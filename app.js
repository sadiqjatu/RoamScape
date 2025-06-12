//Requiring packages or modules
if(process.env.NODE_DEV != "production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/booking.js");

app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded( {extended: true} ));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/assets")));

let dbUrl = process.env.ATLASDB_URL;

main().then( ()=>{
    console.log("Connected to DB");
}).catch( (err) => {
    console.log(err);
});

//Connecting node.js to the mongoDB database
async function main(){
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600   //for lazy update
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  //cookie expires after 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use( session(sessionOptions) );     //an attempt to make session stateful
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//using local middleware that can be directly used in ejs templates
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");      //res.locals.successMsg is an array
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/bookings", bookingRouter);

app.get('/search', async (req, res) => {
    const locationQuery = req.query.location;
  
    try {
      const listings = await Listing.find({
        location: { $regex: locationQuery, $options: 'i' } // case-insensitive
      });
  
      res.render('listings/result.ejs', { listings, searchQuery: locationQuery });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

app.get("/filter", async (req, res) => {
    try{
        const category = req.query.category;
        console.log(category);
        const listings = await Listing.find({
            category: { $regex: category, $options: "i"}
        });
        res.render("listings/index.ejs", { allListings: listings});
    } catch(err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

app.get("/bookings/user/", (req, res) => {
    req.flash("error", "You must be logged in!");
    res.redirect("/login");
});

//catch-all route or wildcard route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

//ERROR handling middleware
app.use( (err, req, res, next) => {
    let {status = 500, message = "Some error occurred"} = err;
    res.status(status).render("listings/error.ejs", {err: err} );
});

app.listen(8080, ()=>{
    console.log("App is listening on port : 8080");
});