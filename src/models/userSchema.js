import mongoose from "mongoose";
const dataSchema = new mongoose.Schema(
  {
    useremail: {
      type: String,
      required: true
    },
    fullname: { type: String, required: true },
    userpass: {
      type: String,
      required: true,
      minlength: 6
    },

    userimage: {
      type: String,
      default: ""
    },
    userimageid: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);
const user = mongoose.model("User", dataSchema);
export default user;
