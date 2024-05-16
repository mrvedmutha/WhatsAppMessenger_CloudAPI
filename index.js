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

  if (hubMode && token) {
    if (hubMode === "subscribe" && token === myToken) {
      res.status(200).send(hubChallenge);
    } else {
      res.status(403);
    }
  }
});

app.post("/webhook", (req, res) => {
  let bodyParam = req.body;
  console.log(bodyParam);
  console.log(JSON.stringify(bodyParam, null, 2));
  if (bodyParam.object) {
    if (
      bodyParam.entry &&
      bodyParam.entry[0].changes &&
      bodyParam.entry[0].changes[0].value.message &&
      bodyParam.entry[0].changes[0].value.message[0]
    ) {
      let myPhoneID =
        bodyParam.entry[0].changes[0].value.metadata.phone_number_id;
      let fromNum = bodyParam.entry[0].changes[0].message[0].from;
      let messageBody = bodyParam.entry[0].changes[0].message[0].text.body;
      axios({
        method: "POST",
        url: `https://graph.facebook.com/v19.0/${myPhoneID}/messages?access_token=${accessToken}`,
        data: {
          messaging_product: "whatsapp",
          to: fromNum,
          text: {
            body: "Hi...This is test message",
          },
          headers: {
            "Content-Type": "application/json",
          },
        },
      });
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});
