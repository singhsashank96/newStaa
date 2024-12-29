const mongoose = require("mongoose");

// Game Schema
const gameSchema = new mongoose.Schema({
  gameName: { type: String, required: true }, // Name or ID of the game
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs participating in the game
  winningAmount: { type: Number, required: true }, // Amount to the winner
  perUserAmount: { type: Number, required: true }, // Amount each user contributes
  status: { type: String, enum: ["ongoing", "completed", "canceled"], default: "ongoing" }, // Game status
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // Admin who created the game
  createdAt: { type: Date, default: Date.now }, // Game creation date
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
