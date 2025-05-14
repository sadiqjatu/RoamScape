//Requiring packages
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//Establishing connection between node.js and mongoDB through mongoose package
main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/roamscape");
}

//creating an asynchronous funtion to store sample data in mongoDB database
const init = async () =>{
    await Listing.deleteMany({});   //deletes all the document if exists
    initData.data = initData.data.map( (obj) => ({...obj, owner: "68041c125c127200a011f784"}));
    await Listing.insertMany(initData.data);
    console.log("Sample data saved!");
}

init();     //Storing sample data