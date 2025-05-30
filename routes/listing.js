const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const ExpressError = require("../utils/ExpressError.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/"});

const listingController = require("../controllers/listing.js");

//Index Route + create route
router.route("/")
    .get(wrapAsync(listingController.index))
    // .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));
    .post(upload.single("listing[image][url]"), (req, res) => { 
        res.send(req.file)
    });

//New Route - serve a new form
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show Route - show specific listing + update route
router.route("/:id")
    .get( wrapAsync(listingController.showListing))
    .put( isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    .delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route - serve an edit form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;