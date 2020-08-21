let Playlist = require("../models/playlist");

middlewareObj = {}


middlewareObj.checkPlaylistOwner = function(req,res,next){
	// console.log("user_id = "+req.user._id)

	 if(req.isAuthenticated()){
	    Playlist.findById(req.params.id,function(err,foundPlaylist){

	        console.log(foundPlaylist.author.id);
	        if(err){
	            res.redirect("/playlists");
	        }else{
	            if(foundPlaylist.author.id.equals(req.user._id)){
	                next();
	            }
	            else{
	                res.redirect("back");
	            }
	        }
	    });
	}
	else{
	    req.flash("error", "You need to Log in first!");
		res.redirect("/login");
	}
}


middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		next();
	}else{
		req.flash("error", "You need to Log in first!");
		res.redirect("/login");	
	}
	
}

module.exports = middlewareObj;