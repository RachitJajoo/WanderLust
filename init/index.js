const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  const newdata = initData.data.map((obj) => ({...obj , owner : "6543499e55da36ba5fe28208"}));
  await Listing.insertMany(newdata);
  console.log("data was initialized");
};

initDB();