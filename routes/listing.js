const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing, multerErrorHandler} = require("../middleware.js");
const ExpressError = require("../utils/ExpressError.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const listingController = require("../controllers/listing.js");

//Index Route + create route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,
         multerErrorHandler(upload.single("listing[image]")),
          validateListing,
           wrapAsync(listingController.createListing));

//New Route - serve a new form
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show Route - show specific listing + update route
router.route("/:id")
    .get( wrapAsync(listingController.showListing))
    .put( isLoggedIn,
            isOwner,
            multerErrorHandler(upload.single("listing[image]")),    //provides metadata about uploaded file
            validateListing,
            wrapAsync(listingController.updateListing))
    .delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route - serve an edit form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;