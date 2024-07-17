const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const cookieParser = require("cookie-parser");

const router = express.Router();
const secret = process.env.JWT_SECRET;

router.use(cookieParser());

// Handle Google sign-in
router.post("/google", async (req, res) => {
  const { name, email, uid, isAnonymous } = req.body;

  try {
    // Check if user exists, create new user if not
    let user = await User.findOne({ googleId: uid });
    if (!user) {
      user = new User({ displayName: name, email, googleId: uid, isAnonymous });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });

    // Send token in cookie
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

// Check if user is authenticated
router.get("/check", async (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Handle logout
router.get("/logout", (req, res) => {
  res
    .clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    })
    .json({ message: "Logged out successfully!" });
});

module.exports = router;
