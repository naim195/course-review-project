const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const dotenv = require("dotenv");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const User = require("./models/user");
const { userSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");

const courses = require("./routes/course");
const reviews = require("./routes/review");
const instructors = require("./routes/instructor");
const auth = require("./routes/auth");

dotenv.config();
const app = express();
const mongoURL = process.env.DB_URL;
const backendUrl = process.env.BACKEND_URL;

// MongoDB Connection
mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Middleware
app.use(helmet());
app.use(compression());

// CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (origin === undefined || origin.match(/\.vercel\.app$/)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
app.use(cookieParser()); // Add cookie-parser middleware here

// Routes
app.use("/courses", courses);
app.use("/courses/:courseId/reviews", reviews);
app.use("/instructors", instructors);
app.use("/auth", auth);

app.get("/", (req, res) => {
  res.send("Backend says hi!!");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  console.log(err);
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).json({ error: err.message });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
