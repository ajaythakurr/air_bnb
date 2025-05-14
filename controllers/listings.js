const Listing = require("../models/listing");
const axios = require('axios');

//index route---------------------------------------------------------
module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

//new Create route----------------------------------------------------
module.exports.renderNewForm = (req,res)=>{
   
    res.render("listings/new.ejs");
};
module.exports.createListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,">>",filename);
    const listing =new Listing(req.body);
    listing.owner = req.user._id;
    listing.image = {url:url,filename:filename};
    await listing.save();
    req.flash("success","new listing created!");
    res.redirect("/listings");  
}

//show route---------------------------------------------------------
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author"
        }
    })
    .populate("owner");
    
    const fullAddress = `${listing.title},${listing.location}, ${listing.country}`;
    let coordinates = { lat: 19.0760, lng: 72.8777 }; // fallback coords (Mumbai)

    try {
        const geoResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: fullAddress,
            key: process.env.GOOGLE_API_KEY
        }
        });

        if (geoResponse.data.results.length > 0) {
        coordinates = geoResponse.data.results[0].geometry.location;
        }
    } catch (err) {
        console.error('Geocoding error:', err.message);
    }

    if(!listing){
        req.flash("error","listing not found!");
        res.redirect("/listings");
    }
    else 
    {
       
        res.render("listings/show.ejs",{listing,coordinates,GOOGLE_API_KEY: process.env.GOOGLE_API_KEY });
    }
}

//edit route---------------------------------------------------------
module.exports.renderEditForm = async(req,res)=>{
    let {id}= req.params;
    let listing =await Listing.findById(id);
    if(!listing){
        req.flash("error","listing not found!");
        return res.redirect("/listings");
    } 
    let originalImage = listing.image.url;
    originalImage=originalImage.replace("/upload","/upload/w_1000/q_35/f_auto")
    res.render("listings/edit",{listing,originalImage});
}
//update route---------------------------------------------------------
module.exports.updateListing = async (req,res)=>{
    let {id}= req.params;
    let {title,description,price,location,country}= req.body;
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        let image = {url:url,filename:filename};
        await Listing.findByIdAndUpdate(id,{title:title,description:description,image:image,price:price,location:location,country:country});
    }
    else await Listing.findByIdAndUpdate(id,{title:title,description:description,price:price,location:location,country:country});

    req.flash("success","updated!");
    res.redirect("/listings");
}

//delete route---------------------------------------------------------
module.exports.deleteListing = async (req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","deleted!");
    res.redirect("/listings");
}



// search route---------------------------------------------------------

module.exports.search = async(req,res)=>{
    const {search} = req.query;
    const allListings = await Listing.find({title:{$regex:search,$options:"i"}});
    if(allListings.length){
        res.render("listings/index.ejs",{allListings});
    }
    else {
        req.flash("error","No match found!");
        res.redirect("/listings");
    }
    
}

//category filter ---------------------------------------------------------
module.exports.category = async(req,res)=>{
    const {category} =req.params;
    const allListings = await Listing.find({ categories: { $regex: new RegExp(category, "i") } });

    if(allListings.length){
        res.render("listings/index.ejs",{allListings});
    }
    else {
        req.flash("error","No Listing with this Category")
        res.redirect("/listings");
    }
}