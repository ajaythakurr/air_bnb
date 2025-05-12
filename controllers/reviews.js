const Listing = require("../models/listing");
const Review = require("../models/review");


//ADD REVIEW  --post review route---------------------------------------------------------
module.exports.createReview = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success","review added!");
    res.redirect(`/listings/${listing._id}`);

};



//DELETE REVIEW -- delete review route-------------------------------------------------------
module.exports.deleteReview = async (req,res)=>{
    let{id,reviewId} = req.params;

    let res1 = await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    let res2 = await Review.findByIdAndDelete(reviewId);

    console.log(res1);
    console.log(res2);

    req.flash("success","review deleted!");
    res.redirect(`/listings/${id}`);

};