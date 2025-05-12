const express = require('express');
const router = express.Router();
const WrapAsync = require("../utels/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware');
const userController = require("../controllers/user");


//SIGNUP ---------------------------------------------------
router.get("/signup",
    userController.signupForm
);

router.post("/signup",
    WrapAsync (userController.signup)
);


//LOGIN ----------------------------------------------------
router.get("/login",
    userController.loginForm
);

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate('local',
    { 
        failureRedirect: '/user/login',
        failureFlash: true,

    })
    ,userController.login
);


//LOGOUT ------------------------------------------------------
router.get("/logout",
    userController.logout
)


module.exports =router;