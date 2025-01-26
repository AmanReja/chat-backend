import Message from "../models/messageSchema.js";
import Conversation from "../models/conversationSchema.js";
import { getReceiverSocketid, io } from "../index.js";

export const sendmessage = async (req, res) => {
  try {
    const { message } = req.body; // Accessing the message content from the request body
    const { id: receiverid } = req.params; // Receiver's ID from the request parameters
    const senderid = req.user._id; // Sender's ID from the authenticated user

    // Find an existing conversation between the sender and receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [senderid, receiverid] }
    });

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderid, receiverid]
      });
    }

    // Create a new message
    const newMessage = new Message({
      senderid,
      receiverid,
      message
    });

    // Save the new message
    await newMessage.save();

    // Add the message ID to the conversation's messages array
    conversation.messages.push(newMessage._id);
    await conversation.save();

    // Get the receiver's socket ID and emit the new message if connected
    const receiverSocketId = getReceiverSocketid(receiverid);
    if (receiverSocketId) {
      console.log(
        "Emitting newMessage to socket:",
        receiverSocketId,
        newMessage
      );
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Send a success response
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getmessage = async (req, res) => {
  try {
    const { id: receiverid } = req.params; // Receiver's ID from the request parameters
    const senderid = req.user._id; // Sender's ID from the authenticated user
    const conversation = await Conversation.findOne({
      participants: { $all: [senderid, receiverid] }
    }).populate("messages");

    if (!conversation) {
      return res.status(404).json({ message: "No conversation found" }); // Return 404 for not found
    }
    const messages = conversation.messages;
    return res.status(200).json({ messages }); // Return 'messages' key for clarity
  } catch (error) {
    console.error("Error in getMessage controller:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteAllMessages = async (req, res) => {
  try {
    const { id } = req.params; // Get the conversation ID from the request parameters
    const senderid = req.user._id; // Get the sender's ID from the authenticated user

    // Step 1: Find the conversation by its ID
    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Step 2: Check if the current user is a participant in the conversation
    if (!conversation.participants.includes(senderid)) {
      return res
        .status(403)
        .json({ message: "You are not a participant of this conversation" });
    }

    // Step 3: Delete all messages related to this conversation
    await Message.deleteMany({ _id: { $in: conversation.messages } });

    // Step 4: Clear the conversation's message array (removes references to deleted messages)
    conversation.messages = [];
    await conversation.save();

    // Step 5: Send success response
    res.status(200).json({ message: "All messages deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAllMessages controller:", error);
    res.status(500).json({ message: error.message });
  }
};
