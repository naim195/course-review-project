const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const cookieParser = require("cookie-parser");

const router = express.Router();
const secret = process.env.JWT_SECRET;

// Ensure cookie-parser middleware is used
router.use(cookieParser());

// POST route for handling Google sign-in
router.post("/google", async (req, res) => {
  const { name, email, uid } = req.body;

  try {
    // Check if the user already exists in the database
    let user = await User.findOne({ googleId: uid });
    if (!user) {
      // Create a new user if not found
      user = new User({ displayName: name, email, googleId: uid });
      await user.save();
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });

    // Send the token as an HTTP-only cookie
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      })
      .json({ user });
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
});

// GET route to check if the user is authenticated
router.get("/check", async (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    // If authenticated, return the user data
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// GET route to log out the current user
router.get("/logout", (req, res) => {
  // Clear the authentication cookie
  res
    .clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    })
    .json({ message: "Logged out successfully!" });
});

module.exports = router;
