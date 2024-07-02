const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.js");

router.post("/send", chatController.sendMessage);
router.post("/webhook", chatController.webhook);
router.get("/webhook", chatController.verifyWebhook);

module.exports = router;
