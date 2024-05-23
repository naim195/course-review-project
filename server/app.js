const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend says hi!!");
});

app.listen(3000, (req, res) => {
  console.log("server running");
});