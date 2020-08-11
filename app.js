let express         = require("express"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Playlist 		= require("./models/playlist")
    // methodOverride  = require("method-override"),
    app = express();

    app.use(bodyParser.urlencoded({extended: true}));
    app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/playlists", { useNewUrlParser: true , useUnifiedTopology:true});


app.get("/playlists",function(req,res){
	res.render("playlists");
});

// var newPL = new Playlist({
// 	name: "FAYAH",
// 	image: "https://www.melodynest.com/wp-content/uploads/2019/06/SPACE-BLANK_chs060619-607x607.png",
// 	description: "Hip-Hop.",
// 	URL: "https://open.spotify.com/playlist/2dYqoEgm8p6kUnZZKwjtpl?si=2bBqExudQAyS0FnYec8Hvg",
// 	eUrl: "https://open.spotify.com/embed/playlist/2dYqoEgm8p6kUnZZKwjtpl?si=2bBqExudQAyS0FnYec8Hvg"
// });

// Playlist.create(newPL, function(err, PL){
// 	if(err){
// 		console.log(err);
// 	}
// 	else{
// 		console.log(PL);
// 	}
// });

app.listen(3000, function(){
	console.log("The Server has started!");
});