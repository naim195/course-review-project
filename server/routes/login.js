const express = require('express');
const passport = require('passport');

const router = express.Router();

const successLoginUrl = 'http://localhost:5173/login/success';
const failureLoginUrl = 'http://localhost:5173/login/error';

router.get("/auth/google",
  passport.authenticate('google', { scope: ['email','profile']})
)

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: successLoginUrl,
    failureRedirect: failureLoginUrl,
  failureFlash:"Something went wrong",
}), (req, res) => {
    res.send("Thanks for signing in");
})

module.exports = router;