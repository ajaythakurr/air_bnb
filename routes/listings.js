const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utels/wrapAsync");
const {isLoggedIn,isOwner,validateListing} = require("../middleware");
const listingController = require("../controllers/listings");
const multer  = require('multer')
const {storage} = require("../cloudconfig");
const upload = multer({ storage })

//categories route
router.get("/categories/:category",wrapAsync(listingController.category));
//search route
router.get("/search",wrapAsync(listingController.search));
//router.route
router
 .route("/")
 .get(wrapAsync(listingController.index)) //index route
 .post(isLoggedIn,validateListing,upload.single('listing.image'),wrapAsync(listingController.createListing)); //create listing 
 
//new Create route
router.get("/newlist",isLoggedIn,listingController.renderNewForm);

router
 .route("/:id")
 .get( wrapAsync(listingController.showListing))//Show route
 .put(isLoggedIn,isOwner,validateListing,upload.single("image"),wrapAsync(listingController.updateListing)) //update route
 .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing)); //delete route


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));




module.exports = router;