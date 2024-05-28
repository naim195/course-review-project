const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require('compression');

const courses = require("./routes/course");
const reviews = require("./routes/review");

const app = express();

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/coursereview").then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Failed to connect to MongoDB", err);
});

// Middleware
app.use(compression());  
app.use(cors());
app.use(express.json());


// Routes
app.use("/courses", courses);
app.use("/courses/:courseId/reviews", reviews);

app.get("/", (req, res) => {
  res.send("Backend says hi!!");
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
