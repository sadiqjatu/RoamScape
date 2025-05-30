const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn} = require("../middleware.js")
const {
    createBooking,
    getUserBookings,
    cancelBooking,
  } = require("../controllers/booking.js");

router.post("/", wrapAsync(createBooking)); // Book a listing
router.get("/user/:userId", isLoggedIn, wrapAsync(getUserBookings)); // Get bookings by user
router.patch("/:id/cancel", wrapAsync(cancelBooking)); // Cancel booking

module.exports = router;