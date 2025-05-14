if(process.env.NODE_ENV != "productio"){
    require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const  methodOverride = require('method-override');
const ejsMate= require("ejs-mate");
const ExpressError = require("./utels/ExpressErrors");
const { error } = require("console");
const session = require("express-session");
const MongoStore =require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const listingRouter = require("./routes/listings");
const reviewRouter = require ("./routes/reviews");
const userRouter = require("./routes/user");

app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));

app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
// app.set("utels",path.join(__dirname,"/utels"));

const dbUrl = process.env.ATLAS_URL;

main()
.then(()=> console.log("connected to mongodb"))
.catch((err)=>console.log(err));

async  function main(){
    await mongoose.connect(dbUrl);
};

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*60*60
});

store.on("error",()=>{
    console.log("ERROR,in MONGO SESSION STORE",err);
});
//session options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httponly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
};


// //root route
// app.get("/",(req,res)=>{
//     res.redirect("/listings");
// })


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

app.get("/demouser",async (req,res)=>{
    const user = new User({
        email:"student@getMaxListeners.com",
        username: "deltaStudent"
    });

    let newUser = await User.register(user,"hello-world");
    res.send(newUser);

})

//user routes
app.use("/user",userRouter);


//listings routes
app.use("/listings",listingRouter);

//Reviews
app.use("/listings/:id/reviews",reviewRouter);

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