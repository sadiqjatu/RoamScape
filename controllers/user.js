const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("user/signup.ejs");
}

module.exports.signup = async(req, res) => {
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
}

module.exports.renderLoginForm = (req, res) => {
    res.render("user/login.ejs");
}

module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back to the RoamScape!");
    let redirectUrl = res.locals.saveRedirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout( (err) => {
        if(err){
            next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
    console.log(req.user);      //should return null
}