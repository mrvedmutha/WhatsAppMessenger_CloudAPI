const Message = require("../models/chat.js");
const User = require("../models/user.js");
const axios = require("axios");
require("dotenv").config();
const accessToken = process.env.ACCESS_TOKEN; // Add your access token here
const myToken = process.env.VERIFY_TOKEN;

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
    let user = await User.findOne({ waId: to });
    if (!user) {
      user = new User({ waId: to, name: "New User" });
      await user.save();
    }
    const newMessage = new Message({
      from,
      to,
      message,
      contact: user._id,
      msg_is: "Send",
    });
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
      const contact = value.contacts[0];
      const contactName = contact.profile.name;
      const waId = contact.wa_id;

      console.log("Received message from:", from);
      console.log("Message body:", messageBody);

      let user = await User.findOneAndUpdate(
        { waId: from },
        { waId: from, name: contactName },
        { new: true, upsert: true }
      );

      const newMessage = new Message({
        from,
        message: messageBody,
        to: value.metadata.display_phone_number,
        contact: user._id,
        msg_is: "Received",
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
  try {
    const allChats = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      { $group: { _id: "$contact", lastMessage: { $first: "$$ROOT" } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactDetails",
        },
      },
      { $unwind: "$contactDetails" },
    ]);
    res.render("chats/showMessages.ejs", { allChats });
  } catch (error) {
    console.error("Error retrieving chats:", error);
    res.sendStatus(500);
  }
};
