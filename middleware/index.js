let Playlist = require("../models/playlist"),
	Comment = require("../models/comment");

middlewareObj = {}


middlewareObj.checkPlaylistOwner = function(req,res,next){
	

	 if(req.isAuthenticated()){
	    Playlist.findById(req.params.id,function(err,foundPlaylist){

	    	if(err){
	    		req.flash("error", err);
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

middlewareObj.checkCommentOwner = function(req,res,next){

     if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err){
            	req.flash("error", err);
                res.redirect("/playlists");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
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
        res.redirect("back");
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