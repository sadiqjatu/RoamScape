const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");

// module.exports.saveCoordinated = (req, res, next) => {

// }

module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.originalUrl);
    if(!req.isAuthenticated()){
        //save redirect url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.saveRedirectUrl = req.session.redirectUrl;
    }
    next(); //passes control to the next middleware
}

module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

//function(middleware) to handle server side validation
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map( (el) => el.message ).join(",");
        console.log(error);
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
}

//function(middleware) to handle server side validation
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map( (el) => el.message).join(",");
        console.log(error);
        throw new ExpressError(400, errMsg);
    } else{
        next();
    }
}