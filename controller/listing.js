const _ = require("passport-local-mongoose");
const Listing = require("../models/listing.js");

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({}); 
    res.render("./listings/index.ejs" , {allListings});
};

module.exports.renderNewForm = (req , res)=>{
    res.render("./listings/new.ejs");
};


module.exports.showListing = async (req,res)=>{
    const {id} = req.params;
    const content = await Listing.findById(id)
    .populate({path : "reviews",
    populate:{
        path : "author",
    } 
    })
    .populate("owner"); 
    const review = (content.reviews);
    if(!content){
        req.flash("error" ,"Lisitng Doesnt Exist!");
        return res.redirect("/listings");
    }
    // console.log(content);
    res.render("./listings/show.ejs" , { content });
};

module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params;
    const listings = await Listing.findById(id);
    if(!listings){
        req.flash("error" ,"Lisitng Doesnt Exist!");
        return res.redirect("/listings");
    }
    const orginallisting = listings.image.url;
    let previewListing = orginallisting.replace("/upload/" , "/upload/c_fill,h_150,w_250/");
    res.render("listings/edit.ejs" , {content : listings , previewListing});
};

module.exports.createListing = async (req ,res,next) =>{
    const url = req.file.path;
    const filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename};
    await newlisting.save();
    req.flash("success" , "New Listing Added!");
    res.redirect("/listings");
};

module.exports.editLisitng =  async (req ,res)=>{
    const {id} = req.params;
    const { listing } = req.body;
    if(req.file){
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = {url , filename};
    }
    await Listing.findByIdAndUpdate(id , listing);  
    req.flash("success" , "Listing Updated!");
    res.redirect("/listings");
};


module.exports.deleteListing = async (req ,res)=>{
    const {id} = req.params;
    let curr = await Listing.findById(id);
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.searchBar = async(req , res)=>{
    const {title} = req.body;
    const curr = await Listing.findOne({title : title});
    if(!curr){
        req.flash("error","AirBnb Doesnt Exists. Enter an Existing Airbnb");
        return res.redirect("/listings");
    }
    const id = curr._id.toString();
    res.redirect(`/listings/${id}`)
    
}

module.exports.fetchCountries = async () => {
    try {
      // Fetch all documents and extract titles
      const listings = await Listing.find({}, 'title');
      
      // Extract titles into an array
      let countries = listings.map((listing) => listing.title);
      console.log(countries);
      return countries;
    } catch (err) {
      console.error('Error occurred while fetching documents:', err);
      return [];
    }
  };