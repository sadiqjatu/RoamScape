const Booking = require("../models/Booking.js");
const Listing = require("../models/Listing.js");

module.exports.createBooking = async (req, res) => {
    try {
      const { user, listing, checkIn, checkOut, guests } = req.body;
  
      const listingData = await Listing.findById(listing);
      const days = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
      const totalPrice = listingData.price * days;
      
      // Check for conflicting bookings
    const existingBooking = await Booking.findOne({
      listing,
      status: { $ne: "canceled" }, // ignore canceled bookings
      $or: [
        {
          checkIn: { $lt: new Date(checkOut) },
          checkOut: { $gt: new Date(checkIn) }
        }
      ]
    });

    if (existingBooking) {
      req.flash("error", "This listing is already booked for the selected dates.");
      return res.redirect("/listings");
    }

      const newBooking = new Booking({
        user,
        listing,
        checkIn,
        checkOut,
        guests,
        totalPrice,
      });
  
      await newBooking.save();
      req.flash("success", "Congrats! Booking confirmed successfully");
      res.redirect("/listings");
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


module.exports.getUserBookings = async (req, res) => {
    try {
      const bookings = await Booking.find({ user: req.params.userId, status: { $ne: "cancelled" } }).populate("listing");
      res.render("../views/user/myBooking.ejs", {bookings: bookings});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

module.exports.cancelBooking = async (req, res) => {
    try {
      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status: "cancelled" },
        { new: true }
      );
      req.flash("success", "Booking cancelled successfully!");
      res.redirect("/listings");
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


  