const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware');


//SIGN UP rendeer page -----------------------------------------
module.exports.signupForm = (req,res)=>{
    res.render("./users/signup");
};

//SIGN UP post request -----------------------------------------
module.exports.signup = async (req,res)=>{

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
    
}

//LOGIN render page -----------------------------------------
module.exports.loginForm = (req,res)=>{
    res.render("./users/login");
};

//LOGIN post request -----------------------------------------
module.exports.login =  async (req,res)=>{
    req.flash("success","Welcome back!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

//logout ------------------------------------------------------
module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Goodbye!");
        res.redirect("/listings");
    })
};