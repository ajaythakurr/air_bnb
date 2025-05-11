const express = require('express');
const router = express.Router();
const User = require("../models/user");
const WrapAsync = require("../utels/wrapAsync");
const passport = require("passport");

router.get("/signup",(req,res)=>{
    res.render("./users/signup");
})

router.post("/signup",WrapAsync (async (req,res)=>{

    try{
        let {username,email,password} = req.body;
        const newUser = new User({username,email});
    
        const registeredUser= await User.register(newUser,password);
        console.log(registeredUser);
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/user/signup");
    }  
    
}));

router.get("/login",(req,res)=>{
    res.render("./users/login");
});

router.post(
    "/login"
    ,passport.authenticate('local',
        { 
            failureRedirect: '/user/login',
            failureFlash: true,

        }),async (req,res)=>{

    res.redirect("/listings");
});
module.exports =router;