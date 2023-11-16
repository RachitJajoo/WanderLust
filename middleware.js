const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema , reviewSchema } = require("./schema");


module.exports.isLoggedIn = (req , res ,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must  be logged in first!");   
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req ,res ,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }else{
        res.locals.redirectUrl = "/listings";
    }next();
};

module.exports.isOwner = async (req ,res,next)=>{
    const {id} = req.params;
    let curr = await Listing.findById(id);
    if(!curr.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not authorized to alter this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isAuthor = async (req ,res,next)=>{
  const {id,rid} = req.params;
  let curr = await Review.findById(rid);
  if(!curr.author._id.equals(res.locals.currUser._id)){
      req.flash("error" , "You are not authorized to alter this review");
      return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
      if(error){
        const errMsg = error.details.map((el) => el.message).join(","); 
        throw new ExpressError(400,  errMsg);
      }else{
        next();
      }
  }

module.exports.validateReview = (req , res , next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
      const errMsg = error.details.map((el) => el.message).join(","); 
      throw new ExpressError(400,  errMsg);
    }else{
      next();
    }
  }
