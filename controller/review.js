const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.createReview = 
async (req , res)=>{
    const id = req.params.id;
    const currListing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = res.locals.currUser._id;
    currListing.reviews.push(newReview);
    await newReview.save();
    await currListing.save();
    req.flash("success" , "New Review Added")
    res.redirect(`/listings/${id}`)
};

module.exports.deleteReview =
async(req ,res) =>{
    let {id , rid} = req.params;
    await Review.findByIdAndDelete(rid);
    await Listing.findByIdAndUpdate(id, {$pull : { reviews : rid }});
    req.flash("success" , "Review Deleted!")
    res.redirect(`/listings/${id}`);
};