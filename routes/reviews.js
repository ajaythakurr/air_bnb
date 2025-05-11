const express = require("express");
const wrapAsync = require("../utels/wrapAsync");
const {reviewSchema} = require("../schema");
const ExpressError = require("../utels/ExpressErrors");
const Listing = require("../models/listing");
const Review = require("../models/review");
const router = express.Router({mergeParams: true});


const validatateReview = (req,res,next)=>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


//post review route
router.post("/",
    validatateReview, 
    wrapAsync (async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success","review added!");
    res.redirect(`/listings/${listing._id}`);

}));
//delete review route
router.delete("/:reviewId",wrapAsync(async (req,res)=>{
    let{id,reviewId} = req.params;

    let res1 = await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    let res2 = await Review.findByIdAndDelete(reviewId);

    console.log(res1);
    console.log(res2);

    req.flash("success","review deleted!");
    res.redirect(`/listings/${id}`);

}));

module.exports = router;