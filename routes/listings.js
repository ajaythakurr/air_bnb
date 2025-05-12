const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utels/wrapAsync");
const Listing = require("../models/listing");
const {isLoggedIn,isOwner,validateListing} = require("../middleware");

const listingController = require("../controllers/listings");

//index route
router.get("/",
    wrapAsync(listingController.index)
); 

//new Create route
router.get("/newlist",
    isLoggedIn,
    listingController.renderNewForm
);
router.post("/",isLoggedIn,
    validateListing,wrapAsync(listingController.createListing)
);

//Show route
router.get("/:id", 
    wrapAsync(listingController.showListing)
);

//edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);
//update route
router.put("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.updateListing)
);

//delete route
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
);

module.exports = router;
