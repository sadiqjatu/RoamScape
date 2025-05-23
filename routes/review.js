const express = require("express");
const router = express.Router( {mergeParams: true} );
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

//Review
//post review route
router.post("/", isLoggedIn, validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();

    console.log("New review added");
    req.flash("success", "Review created!");
    res.redirect(`/listings/${listing._id}`);
}));

//delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async(req, res) =>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});  //delete from listing.reviews array
    await Review.findByIdAndDelete(reviewId);    //delete from review model
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${req.params.id}`);
}));

module.exports = router;