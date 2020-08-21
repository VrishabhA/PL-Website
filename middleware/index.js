let Playlist = require("../models/playlist");

middlewareObj = {}


middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		next();
	}else{
		req.flash("error", "You need to Log in first!");
		res.redirect("/login");	
	}
	
}

module.exports = middlewareObj;