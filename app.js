if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
const express = require("express");
const app = express();
const path =require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js"); 

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const Listing = require('./models/listing.js');
const wrapAsync = require('./utils/wrapAsync.js');
const { recommend } = require('./utils/searchrecommend.js');

const dbUrl = process.env.ATLAS_DB;
async function main() {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,})};

main().then(() =>{console.log("DB connected");}).catch((err) => { console.log(err);});


app.set("view engine","ejs");
app.set("views" , path.join(__dirname,"views"));
app.use(express.urlencoded({ extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);//TO USE EJS MATE

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
    touchAfter: 3600*12,
  }
});
store.on("error" , ()=>{
  console.log("Error in Mongo Session Store".err);
})
const sessionOptions = {
  store,
  secret : process.env.SECRET , 
  resave : false,
  saveUninitialized : true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly : true,
  },
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

app.get('/titles', wrapAsync(recommend));


app.use("/" , userRouter);
app.use("/listings" ,listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);




//ROOT PAGE
app.get("/" , (req , res)=>{
  res.redirect("/listings");
});


//------------------------------------------------------Error Handling ----------------------------------------
app.all("*" , (req , res ,next ) =>{
  next(new ExpressError(404 , "Page Not Found"));
});

app.use(( err , req , res , next ) => {
  let {statusCode = 500, message ="something went wrong"} = err;
  res.status(statusCode).render("./error/error.ejs" , { err });
});

app.listen(8080 , () =>{
    console.log("Server is listening to port 8080");
});
