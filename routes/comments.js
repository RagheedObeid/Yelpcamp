var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware=require("../middleware");//we dont have to put index.js because its the defualt file 
// comments new
router.get("/new", middleware.isLoggedIn, function(req , res){
	//find campground by id
	console.log(req.params.id);
	Campground.findById(req.params.id, function(err, campground){
		if (err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});	
		}
	})	
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
	//look up campground using id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds")
		}else{
			console.log(req.body.comment)
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				}else{
					//add username and id to comment
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
					
					//save comment
					campground.comments.push(comment);
					campground.save();
					console.log(comment);
					req.flash("succes", "succesfully added comment");
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
		//create new comments
		//connect new comment to campground
		//redirect to campground show page
	});
});

//comments edit route to get you to the edit page
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	})

})


//COMMENT UPDATE 
router.put("/:comment_id", middleware.checkCommentOwnership,function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
	if(err){
		res.redirect("back");
	}else{
		res.redirect("/campgrounds/"+req.params.id);
	}	
	});
});


//comment destroy router
router.delete("/:comment_id", middleware.checkCommentOwnership ,function(req, res){
	//find and remove
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("succes", "Comment deleted");
			res.redirect("/campgrounds/"+ req.params.id);
		}
	})
})



module.exports= router;