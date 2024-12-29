const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      // required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    imageurl: {
      type: String,
      default: "",
    },
    reaction: {
      type: String,
      default: "",
    },
    seenby: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    deletedby: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replyto: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "Message",
    },
    gameRequestStatus: {  // New field to track the game request status
      type: String,
      enum: ["waiting", "accepted", "denied" ,""],  // Enum to restrict values to 'waiting', 'accepted', or 'denied'
      default: "",  // Default status is 'waiting' when a new game request is created
    },
    gameAmount: {  // Optional: New field to track the amount of the game request
      type: Number,
      default: 0,  // You can set this to 0 if no amount is associated with the message initially
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
