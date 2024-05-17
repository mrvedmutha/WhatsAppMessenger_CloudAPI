// // const mongoose = require("mongoose");
// const express = require("express");
// const bodyParser = require("body-parser");
// const axios = require("axios");
// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 3000;
// const accessToken = process.env.TOKEN;
// const myToken = process.env.MYTOKEN;
// app.use(bodyParser.json());

// app.get("/", (req, res) => {
//   res.status(200).send("Hello, this is WhatsApp Cloud API");
// });

// app.get("/webhook", (req, res) => {
//   let hubMode = req.query["hub.mode"];
//   let hubChallenge = req.query["hub.challenge"];
//   let token = req.query["hub.verify_token"];
//   console.log("Verification request received");
//   console.log("Mode:", hubMode);
//   console.log("Token:", token);
//   console.log("Challenge:", hubChallenge);

//   if (hubMode && token === myToken) {
//     console.log("Token verified successfully");
//     res.status(200).send(hubChallenge);
//   } else {
//     console.log("Token verification failed");
//     res.status(403).send(`Forbidden!`);
//   }
// });

// app.post("/webhook", async (req, res) => {
//   let bodyParam = req.body;
//   console.log("Received webhook event:", JSON.stringify(bodyParam, null, 2));
//   if (bodyParam.object) {
//     console.log("Inside Body Param");
//     if (
//       bodyParam.entry &&
//       bodyParam.entry[0].changes &&
//       bodyParam.entry[0].changes[0].value.message &&
//       bodyParam.entry[0].changes[0].value.message[0]
//     ) {
//       console.log("Body param validated");
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
//           data: responseMessage,
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

// app.listen(port, "0.0.0.0", () => {
//   console.log("server is listening");
// });

const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express().use(body_parser.json());

const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN; //prasath_token

app.listen(process.env.PORT, () => {
  console.log("webhook is listening");
});

//to verify the callback url from dashboard side - cloud api side
app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let challange = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode === "subscribe" && token === mytoken) {
      res.status(200).send(challange);
    } else {
      res.status(403);
    }
  }
});

app.post("/webhook", (req, res) => {
  //i want some

  let body_param = req.body;

  console.log(JSON.stringify(body_param, null, 2));

  if (body_param.object) {
    console.log("inside body param");
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0]
    ) {
      let phon_no_id =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

      console.log("phone number " + phon_no_id);
      console.log("from " + from);
      console.log("boady param " + msg_body);

      axios({
        method: "POST",
        url:
          "https://graph.facebook.com/v19.0/" +
          phon_no_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: "Hi.. I'm Prasath, your message is " + msg_body,
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

app.get("/", (req, res) => {
  res.status(200).send("hello this is webhook setup");
});
