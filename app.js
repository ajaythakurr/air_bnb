const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const  methodOverride = require('method-override');
const ejsMate= require("ejs-mate");
const wrapAsync = require("./utels/wrapAsync");
const ExpressError = require("./utels/ExpressErrors");
const { error } = require("console");
const {listingSchema,reviewSchema} = require("./schema");
const Review = require("./models/review");

app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded(extended = true));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
// app.set("utels",path.join(__dirname,"/utels"));


main()
.then(()=> console.log("connected to mongodb"))
.catch((err)=>console.log(err));
async  function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust')
}
//root route
app.get("/",(req,res)=>{
    res.send("Hi, I am Root");
})

const validateListing = (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

const validatateReview = (req,res,next)=>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
//index route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})); 
//new Create route
app.get("/listings/newlist",(req,res)=>{
    res.render("listings/new.ejs");
});

app.post("/listings",
    validateListing,
    wrapAsync(async (req,res,next)=>{
        const listing =new Listing(req.body);
        await listing.save();
        res.redirect("/listings");  
    }
));

//Show route
app.get("/listings/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}))

//edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let listing =await Listing.findById(id);
    res.render("listings/edit",{listing});
}));
//update route
app.put("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const {title,description,price,location,country}=req.body;
    await Listing.findByIdAndUpdate(id,{title:title,description:description,price:price,location:location,country:country});
    res.redirect("/listings");
}));

//delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//Reviews
//post review route
app.post("/listings/:id/reviews",
    validatateReview, 
    wrapAsync (async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);

}));
//delete review route
app.delete("/listings/:id/review/:reviewId",wrapAsync(async (req,res)=>{
    let{id,reviewId} = req.params;

    let res1 = await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    let res2 = await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);

}));

// Wildcard route for handling undefined routes
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });

// Error-handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.render("error.ejs",{message});
});

app.listen(3000,()=>{
    console.log("server is listening to port 3000");
});