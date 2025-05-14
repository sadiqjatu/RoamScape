const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

//serve signup form
router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
});

//post signup information to db
router.post("/signup", wrapAsync(async(req, res) => {
    try{
        let {username, email, password} = req.body;
        let newUser = new User({
            email: email,
            username: username
        });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) { return next(err);}
            req.flash("success", "Congratulations, your account has been successfully created!");
            res.redirect("/listings");
        });
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

//serve login form
router.get("/login", (req, res) => {
    res.render("user/login.ejs");
});

//authenticate user
router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async(req, res) => {
    req.flash("success", "Welcome back to the RoamScape!");
    let redirectUrl = res.locals.saveRedirectUrl || "/listings";
    res.redirect(redirectUrl);
});

//handle logout get request
router.get("/logout", (req, res, next) => {
    req.logout( (err) => {
        if(err){
            next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
    console.log(req.user);      //should return null
});

module.exports = router;