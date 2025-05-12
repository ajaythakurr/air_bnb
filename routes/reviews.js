const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utels/wrapAsync");
const {isLoggedIn,validatateReview, isReviewAuthor} = require("../middleware");
const reviewController = require("../controllers/reviews");



//ADD REVIEW  --post review route---------------------------------------------------------
router.post("/",
    isLoggedIn,
    validatateReview, 
    wrapAsync (reviewController.createReview)
);

//DELETE REVIEW -- delete review route-------------------------------------------------------
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
);




module.exports = router;