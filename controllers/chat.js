const Message = require("../models/chat.js");
const axios = require("axios");
require("dotenv").config();
const accessToken = process.env.ACCESS_TOKEN; // Add your access token here
const myToken = process.env.VERIFY_TOKEN;

module.exports.getChats = async (req, res) => {
  try {
    const chats = await Message.find().sort({ timestamp: -1 });
    res.json(chats);
  } catch (error) {
    console.error("Error retrieving chats:", error);
    res.sendStatus(500);
  }
};

module.exports.sendMessage = async (req, res) => {
  const { message, from, to } = req.body; // Ensure `to` is included in the request body

  const url = `https://graph.facebook.com/v19.0/${process.env.MY_PHONE_ID}/messages?access_token=${accessToken}`;
  const responseMessage = {
    messaging_product: "whatsapp",
    to: to, // Use `to` field for sending message
    text: { body: message },
  };

  try {
    await axios.post(url, responseMessage, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const newMessage = new Message({ from, to, message });
    await newMessage.save();
    console.log(
      "Received webhook event:",
      JSON.stringify(responseMessage, null, 2)
    );
    res.sendStatus(200);
  } catch (error) {
    console.error("Error sending message:", error);
    res.sendStatus(500);
  }
};

module.exports.webhook = async (req, res) => {
  let bodyParam = req.body;
  console.log("Received webhook event:", JSON.stringify(bodyParam, null, 2));

  if (bodyParam.object === "whatsapp_business_account") {
    const entry = bodyParam.entry[0];
    const changes = entry.changes[0];
    const value = changes.value;

    if (value.messages && value.messages[0]) {
      const message = value.messages[0];
      const from = message.from;
      const messageBody = message.text.body;

      console.log("Received message from:", from);
      console.log("Message body:", messageBody);

      const newMessage = new Message({
        from,
        message: messageBody,
        to: value.metadata.display_phone_number,
      });
      await newMessage.save();
    }

    res.sendStatus(200);
  } else {
    console.log(
      "Webhook received but not from WhatsApp Business Account:",
      JSON.stringify(bodyParam, null, 2)
    );
    res.sendStatus(404);
  }
};

module.exports.verifyWebhook = (req, res) => {
  let hubMode = req.query["hub.mode"];
  let hubChallenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];
  console.log("Verification request received");
  console.log("Mode:", hubMode);
  console.log("Token:", token);
  console.log("Challenge:", hubChallenge);

  if (hubMode && token === myToken) {
    console.log("Token verified successfully");
    res.status(200).send(hubChallenge);
  } else {
    console.log("Token verification failed");
    res.status(403).send(`Forbidden!`);
  }
};

module.exports.getChats = async (req, res) => {
  const { user, contact } = req.query;

  try {
    const chats = await Message.find({
      $or: [
        { from: user, to: contact },
        { from: contact, to: user },
      ],
    }).sort({ timestamp: 1 });

    res.json(chats);
  } catch (error) {
    console.error("Error retrieving chats:", error);
    res.sendStatus(500);
  }
};
