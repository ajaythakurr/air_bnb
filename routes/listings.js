const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utels/wrapAsync");
const {isLoggedIn,isOwner,validateListing} = require("../middleware");
const listingController = require("../controllers/listings");

//router.route
router
 .route("/")
 .get(wrapAsync(listingController.index)) //index route
 .post(isLoggedIn,validateListing,wrapAsync(listingController.createListing)); //create listing 

//new Create route
router.get("/newlist",isLoggedIn,listingController.renderNewForm);

router
 .route("/:id")
 .get( wrapAsync(listingController.showListing))//Show route
 .put(isLoggedIn,isOwner,wrapAsync(listingController.updateListing)) //update route
 .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing)); //delete route


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports = router;