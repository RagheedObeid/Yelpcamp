var express = require("express");
var router = express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");//we dont have to put index.js because its the defualt file 

router.get("/", function(req, res){
	// get all campgrounds from db 
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
		}
	});
});

router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from formand add to campgrounds array
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var price=req.body.price;
	var author={
		id: req.user._id,
		username: req.user.username
	}
	var newcampground = {name: name, image: image, description: desc, author: author, price:price}
	// create a new campground and save to database
	Campground.create(newcampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			//redirect back to campgrounds page
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});
	
	//res.redirect("/campgrounds");
});

router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// show shows more info about one campground
router.get("/:id", function(req, res){
	//find the campground with the provided id 
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});	
});

//edit CAMPGROUND ROUTE 
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update the correct campground
	
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+ req.params.id)
		}
	})
	// redirect somewhere(show page)
})


//Destroy campground router
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	})
})




module.exports=router;