const express = require("express");
const passport = require("passport");

const router = express.Router();

//const successLoginUrl = 'http://localhost:5173/login/success';
const failureLoginUrl = "http://localhost:5173/login/error";

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: failureLoginUrl,
    failureFlash: "Something went wrong",
  }),
  (req, res) => {
    // Send the user data back to the frontend
    res.send(`
      <script>
          window.opener.postMessage({ user: ${JSON.stringify(req.user)} }, '*');
          window.close();
      </script>
  `);
  },
);

router.get("/auth/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ message: "Logged out successfully!" }); // Send JSON response with status 200
    });
  });
});

module.exports = router;
