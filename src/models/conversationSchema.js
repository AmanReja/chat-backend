import mongoose from "mongoose";
import USer from "../models/userSchema.js";
import messages from "../models/messageSchema.js";

const dataSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: USer
      }
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: messages,
        default: []
      }
    ]
  },
  { timestamps: true }
);

const conversation = mongoose.model("Conversation", dataSchema);
export default conversation;
