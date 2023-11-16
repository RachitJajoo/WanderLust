const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");
const { index, renderNewForm, showListing, createListing, renderEditForm, editLisitng, deleteListing, searchBar } = require("../controller/listing.js");
const multer  = require('multer')
const { cloudinary , storage } = require("../cloudConfig.js");
const upload = multer({ storage });



//All Listings Page
router.get("/", wrapAsync(index));

//New Form Route
router.get("/new" ,isLoggedIn,(renderNewForm));

//CREATE ROUTE
 router.post("/" ,upload.single('listing[image]'),validateListing, wrapAsync(createListing));

//Show Route
router.get("/:id",wrapAsync(showListing));
 
//Update Form Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(renderEditForm));

//Update Route
router.put("/:id", isLoggedIn,isOwner, upload.single('listing[image]'),validateListing ,wrapAsync(editLisitng));

//Delete Route
router.delete("/:id",isLoggedIn,isOwner ,wrapAsync( deleteListing));

//Search Route
router.post("/search" , wrapAsync(searchBar));

module.exports = router ;