const express = require('express');
const router = express.Router();
const User = require("../models/user");
const WrapAsync = require("../utels/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware');


//SIGNUP ---------------------------------------------------
router.get("/signup",(req,res)=>{
    res.render("./users/signup");
})

router.post("/signup",WrapAsync (async (req,res)=>{

    try{
        let {username,email,password} = req.body;
        const newUser = new User({username,email});
    
        const registeredUser= await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        })
       
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/user/signup");
    }  
    
}));


//LOGIN ----------------------------------------------------
router.get("/login",(req,res)=>{
    res.render("./users/login");
});

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate('local',
    { 
        failureRedirect: '/user/login',
        failureFlash: true,

    }),
    async (req,res)=>{
        req.flash("success","Welcome back!");
        const redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
});


//LOGOUT ------------------------------------------------------
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Goodbye!");
        res.redirect("/listings");
    })
})


module.exports =router;