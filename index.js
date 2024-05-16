// const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const accessToken = process.env.TOKEN;
const myToken = process.env.MYTOKEN;
app.use(bodyParser.json());

app.listen(port, "0.0.0.0", (req, res) => {
  console.log("server is listening");
});

app.get("/", (req, res) => {
  res.status(200).send("Hello, this is WhatsApp Cloud API");
});

app.get("/webhook", (req, res) => {
  let hubMode = req.query["hub.mode"];
  let hubChallenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  if (hubMode && token === myToken) {
    res.status(200).send(hubChallenge);
  } else {
    res.status(403).send(`Forbidden!`);
  }
});

app.post("/webhook", async (req, res) => {
  let bodyParam = req.body;
  console.log("Received webhook event:", JSON.stringify(bodyParam, null, 2));
  if (bodyParam.object) {
    if (
      bodyParam.entry &&
      bodyParam.entry[0].changes &&
      bodyParam.entry[0].changes[0].value.message &&
      bodyParam.entry[0].changes[0].value.message[0]
    ) {
      const message = body.entry[0].changes[0].value.messages[0];
      console.log("Received message:", JSON.stringify(message, null, 2));
      const myPhoneID =
        bodyParam.entry[0].changes[0].value.metadata.phone_number_id;
      const fromNum = bodyParam.entry[0].changes[0].message[0].from;
      const messageBody = message.text.body;
      const url = `https://graph.facebook.com/v19.0/${myPhoneID}/messages?access_token=${accessToken}`;
      const responseMessage = {
        messaging_product: "whatsapp",
        to: from,
        text: { body: "Hello! This is an automated response." },
      };
      try {
        await axios.post(url, responseMessage, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Message sent successfully");
      } catch (error) {
        console.error("Error sending message:", error);
      }

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);
  }
});
