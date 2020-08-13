let express         = require("express"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Playlist 		= require("./models/playlist")
    methodOverride  = require("method-override"),
    app = express();


let playlistRoutes = require("./routes/playlist");



app.use(express.static(__dirname + "/public")); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");


mongoose.connect("mongodb://localhost:27017/playlists", { useNewUrlParser: true , useUnifiedTopology:true});

app.use("/playlists", playlistRoutes)

app.listen(3000, function(){
	console.log("The Server has started!");
});