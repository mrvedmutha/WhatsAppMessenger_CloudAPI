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

app.get("/", (req, res) => {
  res.status(200).send("Hello, this is WhatsApp Cloud API");
});

app.get("/webhook", (req, res) => {
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
});

// app.post("/webhook", async (req, res) => {
//   let bodyParam = req.body;
//   console.log("Received webhook event:", JSON.stringify(bodyParam, null, 2));
//   if (bodyParam.object) {
//     if (
//       bodyParam.entry &&
//       bodyParam.entry[0].changes &&
//       bodyParam.entry[0].changes[0].value.message &&
//       bodyParam.entry[0].changes[0].value.message[0]
//     ) {
//       const message = body.entry[0].changes[0].value.messages[0];
//       console.log("Received message:", JSON.stringify(message, null, 2));
//       const myPhoneID =
//         bodyParam.entry[0].changes[0].value.metadata.phone_number_id;
//       const fromNum = bodyParam.entry[0].changes[0].message[0].from;
//       const messageBody = message.text.body;
//       const url = `https://graph.facebook.com/v19.0/${myPhoneID}/messages`;
//       const responseMessage = {
//         messaging_product: "whatsapp",
//         to: fromNum,
//         text: { body: "Hello! This is an automated response." },
//       };
//       try {
//         console.log(
//           "Sending response message:",
//           JSON.stringify(responseMessage, null, 2)
//         );
//         await axios({
//           method: "POST",
//           url: url,
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           data: { responseMessage },
//         });
//         console.log("Message sent successfully");
//       } catch (error) {
//         console.error("Error sending message:", error);
//       }

//       res.sendStatus(200);
//     } else {
//       console.log("No message found in the webhook event");
//       res.sendStatus(404);
//     }
//   } else {
//     console.log("Webhook event object not found");
//     res.sendStatus(404);
//   }
// });

var data = JSON.stringify({
  messaging_product: "whatsapp",
  recipient_type: "individual",
  to: "919941864844",
  type: "text",
  text: {
    preview_url: false,
    body: "text-message-content",
  },
});

var config = {
  method: "post",
  url: "https://graph.facebook.com/v19.0/105241112240368/messages",
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer EAAIPEey6O9sBOZBpQLzLDDk7rpOU65gxlybLSLhsbaXIcZBoheX6ExGPTD0tGXU1WVutDz8d6NCUawIxtssRNkGrErPT1FDPvwBp6QWitEVXhIMLgIMsHNv0BRS48tWX3FUj7L8vVMAELW7mvnq5aOsFVRPgwwT0af4OpgiZB0GzdTGUa3HJeUSQd7hkHHSIMqGsgsKem0dWBYz1E0ZD",
  },
  data: data,
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });

app.listen(port, "0.0.0.0", () => {
  console.log("server is listening");
});
