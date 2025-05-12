const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");


main()
.then(()=> console.log("connected to mongodb"))
.catch((err)=>console.log(err));
async  function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust')
}


const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner: "682097a224e467559eb84caa" 

    }));
    await Listing.insertMany(initData.data);
};

initDB()
.then(()=>console.log("data initilised"))
.catch((err)=>console.log(err));