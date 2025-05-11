const express = require("express");
const wrapAsync = require("../utels/wrapAsync");
const {listingSchema} = require("../schema");
const ExpressError = require("../utels/ExpressErrors");
const Listing = require("../models/listing");
const router = express.Router();


const validateListing = (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


//index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})); 

//new Create route
router.get("/newlist",(req,res)=>{
    res.render("listings/new.ejs");
});
router.post("/",
    validateListing,
    wrapAsync(async (req,res,next)=>{
        const listing =new Listing(req.body);
        await listing.save();
        req.flash("success","new listing created!");
        res.redirect("/listings");  
    }
));

//Show route
router.get("/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","listing not found!");
        res.redirect("/listings");
    }
    else res.render("listings/show.ejs",{listing});
}))

//edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let listing =await Listing.findById(id);
    if(!listing){
        req.flash("error","listing not found!");
        res.redirect("/listings");
    } 
    else res.render("listings/edit",{listing});
}));
//update route
router.put("/:id",wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const {title,description,price,location,country}=req.body;
    await Listing.findByIdAndUpdate(id,{title:title,description:description,price:price,location:location,country:country});
    req.flash("success","updated!");
    res.redirect("/listings");
}));

//delete route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","deleted!");
    res.redirect("/listings");
}));

module.exports = router;
