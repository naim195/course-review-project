const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

require("./passport");
const ExpressError = require("./utils/ExpressError");

const courses = require("./routes/course");
const reviews = require("./routes/review");
const login = require("./routes/login");

const app = express();
const mongoURL = process.env.DB_URL;
const backendUrl = process.env.BACKEND_URL;

dotenv.config();

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
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://apis.google.com", "https://accounts.google.com","'unsafe-inline'"],
      connectSrc: ["'self'", `${backendUrl}`],
      imgSrc: ["'self'", "data:"],
      styleSrc: ["'self'", "'unsafe-inline'"], 
    },
  })
);

app.use(compression());
app.use(
  cors({
    origin: "https://course-review-project-phi.vercel.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }),
);
app.use(express.json());
app.use(mongoSanitize({
  replaceWith: '_'
}))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoURL,
      collectionName: "sessions",
    }),
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/courses", courses);
app.use("/courses/:courseId/reviews", reviews);
app.use(login);

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
