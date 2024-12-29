const express = require("express");
const router = express.Router();

// Import controller functions
const {
  createGame,
  editGame,
  deleteGame,
} = require("../Controllers/gameController");

// Route to create a new game
router.post("/", createGame);

// Route to edit an existing game
router.put("/:id", editGame);  // Using PUT for editing an existing game

// Route to delete a game
router.delete("/:id", deleteGame);  // Using DELETE to remove a game

module.exports = router;
