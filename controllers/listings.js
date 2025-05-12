const Listing = require("../models/listing");

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
    const listing =new Listing(req.body);
    console.log(req.user);
    listing.owner = req.user._id;
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
    if(!listing){
        req.flash("error","listing not found!");
        res.redirect("/listings");
    }
    else 
    {
        console.log(listing.owner);
        res.render("listings/show.ejs",{listing});
    }
}

//edit route---------------------------------------------------------
module.exports.renderEditForm = async(req,res)=>{
    let {id}= req.params;
    let listing =await Listing.findById(id);
    if(!listing){
        req.flash("error","listing not found!");
        res.redirect("/listings");
    } 
    else res.render("listings/edit",{listing});
}
//update route---------------------------------------------------------
module.exports.updateListing = async (req,res)=>{
    let {id}= req.params;
    let {title,description,price,location,country}= req.body;
    await Listing.findByIdAndUpdate(id,{title:title,description:description,price:price,location:location,country:country});
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