const express = require('express');
const router = express.Router();
const WrapAsync = require("../utels/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware');
const userController = require("../controllers/user");


//SIGNUP ---------------------------------------------------
router
 .route("/signup")
 .get(userController.signupForm)
 .post(WrapAsync (userController.signup));


//LOGIN ----------------------------------------------------
router
  .route("/login")
  .get(userController.loginForm)
  .post(saveRedirectUrl,
    passport.authenticate('local',
    { 
        failureRedirect: '/user/login',
        failureFlash: true,

    })
    ,userController.login);


//LOGOUT ------------------------------------------------------
router.get("/logout",
    userController.logout
)


module.exports =router;