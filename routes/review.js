const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isAuthor }= require("../middleware.js");
const { createReview, deleteReview } = require("../controller/review.js");


//CREATE REVIEWS
router.post("/" ,isLoggedIn, validateReview ,wrapAsync(createReview));

//DELETE REVIEWS
router.delete("/:rid" , isLoggedIn , isAuthor , wrapAsync(deleteReview));

  module.exports = router;