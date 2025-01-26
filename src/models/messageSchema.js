import mongoose from "mongoose";
const dataSchema = new mongoose.Schema(
  {
    senderid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiverid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message: {
      type: String,
      maxlength: 1000,
      trim: true,
      validate: [
        {
          validator: (value) => value.length > 0,
          message: "message cannot be empty"
        }
      ]
    },
    image: { type: String },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", dataSchema);

export default Message;
