let express = require("express"),
    router = express.Router(),
    Playlist= require("../models/playlist");
    middleware  = require("../middleware");
    

router.get("/",function(req,res){
	Playlist.find({}, function(err, playlists){
		if(err){
			req.flash("error",err);
		}else{
			res.render("playlist/playlists",{playlists: playlists});
		}
	})
});

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("playlist/new",{flag : true});
});

router.get("/:id", function(req,res){
	Playlist.findById(req.params.id).populate("comments").exec( function(err,playlist){
		if(err){
			req.flash("error",err);
		}else{
			res.render("playlist/show",{playlist: playlist});
		}
	})
});


router.post("/",middleware.isLoggedIn,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var URL = req.body.URL;
	var eUrl = embed(URL);


	var newPL = new Playlist({
		name 		: name,
		image	   	: image,
		description	: description,
		URL 		: URL,
		eUrl		: eUrl,
		author: {
            id : req.user._id,
            username: req.user.username  
        } 
	});

	if(checkURL(URL)){
		Playlist.create(newPL, function(err, PL){
			if (err) {
				req.flash("error",err);
			}else{

				req.flash("success", "Playlist Added!");
				res.redirect("/playlists");
			}
		});
	}
	else{
		req.flash("error","Invalid URL!");
		res.render("playlist/new",{
			error       : req.flash("error"),
			flag        : false,
			name 		: name,
			image	   	: image,
			description	: description,
			URL 		: URL,
			eUrl		: eUrl,
		});
	}

});

//Edit

router.get("/:id/edit",middleware.checkPlaylistOwner, function(req,res){
	Playlist.findById(req.params.id, function(err, playlist){
		if(err){
			req.flash("error",err);
		}else{
			res.render("playlist/edit",{playlist: playlist});
		}
	});
});

router.put("/:id",middleware.checkPlaylistOwner,function(req,res){
	var url = req.body.playlist.URL;

	if(checkURL(url)){
	    Playlist.findOneAndUpdate({_id: req.params.id}, req.body.playlist, {useFindAndModify: false}).exec(function(err,updatedPlaylist){
		    if(err){
		        req.flash("error",err);
		    } else{
		    	req.flash("success","Edited Playlist!");
		        res.redirect("/playlists/"+req.params.id);
		    }
		});
	}
	else{
		req.flash("error","Invalid URL!");
		Playlist.findById(req.params.id, function(err, playlist){
		if(err){
			req.flash("error",err);
		}else{
			res.render("playlist/edit",{error:req.flash("error"), playlist: playlist});
		}
		});
	}

});

router.delete("/:id",middleware.checkPlaylistOwner, function(req,res){
	Playlist.findOneAndDelete({_id: req.params.id}).exec(function(err,deletedPlaylist){
		if(err){
			req.flash("error",err);
		}else{
			req.flash("success", "Deleted Playlist!");
			res.redirect("/playlists");
		}
	})
});

function embed(url){
	var emUrl ="";

	for(var i = 0; i < url.length; i++){
		
		emUrl = emUrl  + url.charAt(i);

		if(emUrl=="https://open.spotify.com"){
			emUrl = emUrl+"/embed";
		}
	}

	return emUrl;
}

function checkURL(url){

	var check ="";
	
	for(var i = 0; i < url.length; i++){

		check = check + url.charAt(i);

		if(check == "https://open.spotify.com/playlist/"|| check == "open.spotify.com/playlist/"){
			if(check == "open.spotify.com/playlist/")
				url = "https://"+ check;
			return true;
		}
	}

	return false;
}

/*var newPL = new Playlist({
	name: "FAYAH",
	image: "https://www.melodynest.com/wp-content/uploads/2019/06/SPACE-BLANK_chs060619-607x607.png",
	description: "Hip-Hop.",
	URL: "https://open.spotify.com/playlist/2dYqoEgm8p6kUnZZKwjtpl?si=2bBqExudQAyS0FnYec8Hvg",
	eUrl: "https://open.spotify.com/embed/playlist/2dYqoEgm8p6kUnZZKwjtpl?si=2bBqExudQAyS0FnYec8Hvg"
});

Playlist.create(newPL, function(err, PL){
	if(err){
		req.flash("error",err);
	}
	else{
		console.log(PL);
	}
});*/

module.exports = router;