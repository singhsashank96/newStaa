const express = require("express");
const router = express.Router();

// Import controller functions

const { createPaymentDetails , updatePaymentDetails , getPaymentDetails } = require("../Controllers/payment_controller");

// Route to create a new game

router.post("/", createPaymentDetails);
router.get("/:userId", getPaymentDetails);


// Route to edit an existing game
router.put("/:id", updatePaymentDetails);  // Using PUT for editing an existing game

// Route to delete a game
// router.delete("/:id", deleteGame);  // Using DELETE to remove a game

module.exports = router;
