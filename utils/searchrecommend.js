const Listing = require("../models/listing");


module.exports.recommend=async (req, res) => {
    try {
      const titles = await Listing.find({}, { _id: 0, title: 1 });
  
      // Extract titles into an array
      const titlesArray = titles.map(listing => listing.title);
  
      // Send the array of titles to the client
      res.json(titlesArray);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching titles');
    }
  };