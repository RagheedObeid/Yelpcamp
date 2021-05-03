var express=require("express");
var app = express();
var bodyparser =require("body-parser");
const mongoose = require("mongoose");
var flash=require("connect-flash");
var passport=require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Campground =require("./models/campground");
var  seedDB = require("./seeds");
var Comment= require("./models/comment");
var User=require("./models/user");

app.use(flash());

//requiring routes
var commentRoutes= require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes= require("./routes/index");



//PASSPORT CONGIFURATION
app.use(require("express-session")({
	secret: "once again rusty wins cutest dog",
	resave: false,
	saveUninitialized: false
	
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");	
	next();
})


mongoose.connect("mongodb://localhost/yelp_camp_v11", {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log("connected to db"))
.catch(error => console.log(error.message));

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(process.env.PORT, process.env.IP, function(){ 
	console.log("the yelpcamp server has started");
});
