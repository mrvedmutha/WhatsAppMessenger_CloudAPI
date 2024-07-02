const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const chatRoutes = require("./routes/chat.js");
const path = require("path");
const ejsMate = require("ejs-mate");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "./public")));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", chatRoutes);

app.get("/chats/new", (req, res) => {
  res.render("./chats/sendMessage.ejs");
});

app.use("/api", chatRoutes);
//working
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is listening on port ${port}`);
});
