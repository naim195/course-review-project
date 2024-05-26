const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const courses = require("./routes/course");

mongoose.connect("mongodb://127.0.0.1:27017/coursereview");

app.use(cors());

app.use("/courses", courses);

app.get("/", (req, res) => {
  res.send("Backend says hi!!");
});

app.listen(3000, (req, res) => {
  console.log("server running");
});
