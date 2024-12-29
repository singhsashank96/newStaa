const Game = require("../Models/Game");

// Create a new game
const createGame = async (req, res) => {
  const { gameName, users, winningAmount, perUserAmount, adminId } = req.body;

  if (!gameName || !users || !winningAmount || !perUserAmount || !adminId) {
    return res.status(400).json({
      error: "Please provide all required fields (gameName, users, winningAmount, perUserAmount, adminId).",
    });
  }

  try {
    const newGame = new Game({
      gameName,
      users,
      winningAmount,
      perUserAmount,
      adminId,
    });

    await newGame.save();

    return res.status(201).json({
      message: "Game created successfully.",
      game: newGame,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// Edit a game (update game details)
const editGame = async (req, res) => {
  const { gameName, users, winningAmount, perUserAmount } = req.body;
  const { id } = req.params;

  try {
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    game.gameName = gameName || game.gameName;
    game.users = users || game.users;
    game.winningAmount = winningAmount || game.winningAmount;
    game.perUserAmount = perUserAmount || game.perUserAmount;

    await game.save();
    res.status(200).json({
      message: "Game updated successfully.",
      game,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// Delete a game
const deleteGame = async (req, res) => {
  const { id } = req.params;

  try {
    const game = await Game.findByIdAndDelete(id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.status(200).json({ message: "Game deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};





module.exports = {
  createGame,
  editGame,
  deleteGame,
};
