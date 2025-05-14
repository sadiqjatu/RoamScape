const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);   //plugin extends the functionality

const User = mongoose.model("User", userSchema);

module.exports = User;   //exporting model