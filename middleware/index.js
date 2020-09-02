let Playlist = require("../models/playlist");

middlewareObj = {}


middlewareObj.checkPlaylistOwner = function(req,res,next){
	

	 if(req.isAuthenticated()){
	    Playlist.findById(req.params.id,function(err,foundPlaylist){

	    	if(err){
	            res.redirect("/playlists");
	        }else{
	            if(foundPlaylist.author.id.equals(req.user._id)){
	                next();
	            }
	            else{
	            	req.flash("error", "You can only edit your submission!");
	                res.redirect("/playlists/"+req.params.id);
	            }
	        }
	    });
	}
	else{
	    req.flash("warning", "You need to Log in first!");
		res.redirect("/login");
	}
}


middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		next();
	}else{
		req.flash("warning", "You need to Log in first!");
		res.redirect("/login");	
	}
	
}

module.exports = middlewareObj;