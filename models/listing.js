const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const Review = require("./review.js");

//Creating schema
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "default-image",
            set: (value) => (value === "" ? "default-image" : value)
        },
        url: {
            type: String,
            required: true,
            default: "https://images.unsplash.com/photo-1488415032361-b7e238421f1b?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (value) => value === "" ? "https://images.unsplash.com/photo-1488415032361-b7e238421f1b?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : value
        }
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price is less than minimum value allowed"],  //ensures price is non-negative
        default: 1,
        set: (value) => (value === "" ? 1 : value) //convert null or undefined to default
    },
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String, // Don't remove type inside
            enum: ['Point'],
            required: true,
            default: 'point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
            default: [0, 0]
        }
    },
    category: {
        type: String,
        enum: ["Trending", "Rooms", "Iconic cities", "Mountains", "Castles", "Amazing pools", "Camping", "Farms", "Arctic", "Domes", "Boats"],
        required: true
    }
});

//mongoose post middleware which gets executed after delete route
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany( {_id: {$in: listing.reviews}} );
    }
});

//Creating model
const Listing = mongoose.models.Listing || mongoose.model("Listing", listingSchema);

//exporting model
module.exports = Listing;