const Listing = require("../models/listing.js");
const axios = require("axios");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});   //find all docs from collection named "listings"
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
}

module.exports.createListing = async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    // 1. Make request to Nominatim API
    const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
            q: newListing.location,
            format: "json",
            limit: 1
        },
        headers: {
            'User-Agent': 'RoamScape/1.0 sadiqjatu.89@gmail.com' // required by Nominatim usage policy
        }
    });

    if (!geoRes.data[0]) {
        req.flash("error", "Location not found. Please try a more specific one.");
        return res.redirect("/listings/new");
    }
    
     // 2. Extract lat and lon
     const geoData = geoRes.data[0]; // first result
     const lat = parseFloat(geoData.lat);
     const lon = parseFloat(geoData.lon);

     //3. create listing with geometry
    newListing.owner = req.user._id;

    newListing.geometry.type = "Point";
    newListing.geometry.coordinates = [lat, lon];

    await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
}

module.exports.showListing = async (req, res, next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: { path: "author"} }).populate("owner");
    if(!listing){
        req.flash("error", "Requested listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing: listing });
}

module.exports.renderEditForm = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Requested listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing: listing });
}

module.exports.updateListing = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        next(new ExpressError(400, "Listing not found or deleted"));
    }
    if(!req.body.listing){
        next(new ExpressError(400, "Please enter valid data in the form"));
    }
    await Listing.findByIdAndUpdate(id, {...req.body.listing}, {runValidators: true});
    req.flash("success", "Listing updated!")
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res, next) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if(!deletedListing){
        next(new ExpressError(400, "Listing not found or already deleted"));
    }
    console.log(deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}