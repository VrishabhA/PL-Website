let Playlist = require("../models/playlist");

middlewareObj = {}


middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next;
	}
	res.redirect("/login");
}

moodule.exports = middlewareObj;