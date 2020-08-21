let express = require("express"),
    router = express.Router(),
    Playlist= require("../models/playlist");
    middleware  = require("../middleware");
    

router.get("/",function(req,res){
	Playlist.find({}, function(err, playlists){
		if(err){
			console.log(err);
		}else{
			res.render("playlist/playlists",{playlists: playlists});
		}
	})
});

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("playlist/new");
});

router.get("/:id", function(req,res){
	Playlist.findById(req.params.id, function(err,playlist){
		if(err){
			console.log(err);
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
		eUrl		: eUrl
	});

	Playlist.create(newPL, function(err, PL){
		if (err) {
			console.log(err)
		}else{

			console.log("Playlist Added!");
			res.redirect("/playlists");
		}
	});
});

//Edit

router.get("/:id/edit",middleware.checkPlaylistOwner, function(req,res){
	Playlist.findById(req.params.id, function(err, playlist){
		if(err){
			console.log(err);
		}else{
			res.render("playlist/edit",{playlist: playlist});
		}
	});
});

router.put("/:id",middleware.checkPlaylistOwner,function(req,res){
    Playlist.findOneAndUpdate({_id: req.params.id}, req.body.playlist, {useFindAndModify: false}).exec(function(err,updatedPlaylist){
	    if(err){
	        console.log(err);
	    } else{
	        res.redirect("/playlists/"+req.params.id);
	    }
	});
});

router.delete("/:id",middleware.checkPlaylistOwner, function(req,res){
	Playlist.findOneAndDelete({_id: req.params.id}).exec(function(err,deletedPlaylist){
		if(err){
			console.log(err);
		}else{
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

/*var newPL = new Playlist({
	name: "FAYAH",
	image: "https://www.melodynest.com/wp-content/uploads/2019/06/SPACE-BLANK_chs060619-607x607.png",
	description: "Hip-Hop.",
	URL: "https://open.spotify.com/playlist/2dYqoEgm8p6kUnZZKwjtpl?si=2bBqExudQAyS0FnYec8Hvg",
	eUrl: "https://open.spotify.com/embed/playlist/2dYqoEgm8p6kUnZZKwjtpl?si=2bBqExudQAyS0FnYec8Hvg"
});

Playlist.create(newPL, function(err, PL){
	if(err){
		console.log(err);
	}
	else{
		console.log(PL);
	}
});*/

module.exports = router;