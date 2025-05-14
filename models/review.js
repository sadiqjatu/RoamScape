const mongoose = require("mongoose");
const {Schema} = require("mongoose");

//creating schema
const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

//creating model
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;