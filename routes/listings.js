const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utels/wrapAsync");
const Listing = require("../models/listing");
const {isLoggedIn,isOwner,validateListing} = require("../middleware");



//index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})); 

//new Create route
router.get("/newlist",isLoggedIn,(req,res)=>{
   
    res.render("listings/new.ejs");
});
router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req,res,next)=>{
        const listing =new Listing(req.body);
        console.log(req.user);
        listing.owner = req.user._id;
        await listing.save();
        req.flash("success","new listing created!");
        res.redirect("/listings");  
    }
));

//Show route
router.get("/:id", wrapAsync(async (req,res)=>{
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
}))

//edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let listing =await Listing.findById(id);
    if(!listing){
        req.flash("error","listing not found!");
        res.redirect("/listings");
    } 
    else res.render("listings/edit",{listing});
}));
//update route
router.put("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req,res)=>{
    let {id}= req.params;
    let {title,description,price,location,country}= req.body;
    await Listing.findByIdAndUpdate(id,{title:title,description:description,price:price,location:location,country:country});
    req.flash("success","updated!");
    res.redirect("/listings");
}));

//delete route
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","deleted!");
    res.redirect("/listings");
}));

module.exports = router;
