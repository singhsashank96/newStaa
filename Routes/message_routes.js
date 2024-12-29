const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer();

const {
  sendMessage,
  allMessage,
  deletemesage,
  sendMessageForGame,
  updateGameRequestStatus
  
} = require("../Controllers/message_controller.js");
const fetchuser = require("../middleware/fetchUser.js");

router.get("/:id/:userid", fetchuser, allMessage);
router.post("/send", fetchuser, upload.single("file"), sendMessage);
// router.post("/send", fetchuser, upload.single("file"), sendMessageForGame);
router.post("/delete", fetchuser, deletemesage);
router.post("/updateGameRequestStatus", fetchuser, updateGameRequestStatus);

module.exports = router;
