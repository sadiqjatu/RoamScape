const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/user.js");

//serve signup form + post signup information to db
router.route("/signup")
    .get( userController.renderSignupForm)
    .post( wrapAsync(userController.signup));

//serve login form + authenticate user
router.route("/login")
    .get( userController.renderLoginForm)
    .post(saveRedirectUrl, 
            passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), 
            userController.login);

//handle logout get request
router.get("/logout", userController.logout);

module.exports = router;