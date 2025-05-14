const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn} = require("../middleware.js")
const {
    createBooking,
    getUserBookings,
    cancelBooking,
  } = require("../controllers/bookingController.js");

router.post("/", createBooking); // Book a listing
router.get("/user/:userId", isLoggedIn, getUserBookings); // Get bookings by user
router.patch("/:id/cancel", cancelBooking); // Cancel booking

module.exports = router;