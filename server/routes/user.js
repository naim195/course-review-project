const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.get("/:googleId", async (req, res) => {
  const { googleId } = req.params;
  try {
    const user = await User.findOne({ googleId }); //check if user already exists
    if (user) {
      res.status(200).json({ exists: true, isAnonymous: user.isAnonymous });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
