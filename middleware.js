const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema,reviewSchema} = require("./schema");
const ExpressError= require("./utels/ExpressErrors");


// isLoggedIn middleware--------------------------------------------------------------
module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must Login to create a Listing");
        return res.redirect("/user/login");
    }
    next();
}

// saveRedirectUrl middleware---------------------------------------------------------
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}


// isOwner middleware------------------------------------------------------------------
module.exports.isOwner = async (req,res,next)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if(res.locals.currentUser && !listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","you do not have permission to do that!");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

// validateListing middleware----------------------------------------------------------
module.exports.validateListing = (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

// ValidateReview middleware----------------------------------------------------------
module.exports.validatateReview = (req,res,next)=>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


// isReviewAuthor middleware---------------------------------------------------
module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","you are not the author of this review!");
        return res.redirect(`/listings/${id}`)
    }
    next();
}