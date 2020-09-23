let mongoose = require("mongoose");

//This model should have Playlist Name, Image, URL (& maybe embeded URL) as attributes

var playlistSchema = new mongoose.Schema({
	name:String,
	image: String, 
	description: String,
	URL: String,
	eUrl: String,
	createdAt: {type: Date, default: Date.now },
	author : {
    	id:{
    		type: mongoose.Schema.Types.ObjectId,
    		ref: "User"
    	},
    	username:String
    },
    comments : [
    {
    	type : mongoose.Schema.Types.ObjectId,
    	ref  : "Comment"
    }]
});

module.exports = mongoose.model("Playlist", playlistSchema);

// var Playlist = mongoose.model("Playlist", playlistSchema);

// var newPL = new Playlist({
// 	name: "FAYAH",
// 	image: "https://www.melodynest.com/wp-content/uploads/2019/06/SPACE-BLANK_chs060619-607x607.png",
// 	description: "Hip-Hop.",
// 	URL: "https://open.spotify.com/playlist/2dYqoEgm8p6kUnZZKwjtpl?si=2bBqExudQAyS0FnYec8Hvg",
// 	eUrl: "https://open.spotify.com/embed/playlist/2dYqoEgm8p6kUnZZKwjtpl?si=2bBqExudQAyS0FnYec8Hvg"
// });

// newPL.save(function(err,PL){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log(PL);
// 	}
// })