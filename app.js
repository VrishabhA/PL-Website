let express         = require("express"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    // methodOverride  = require("method-override"),
    app = express();

    app.use(bodyParser.urlencoded({extended: true}));
    app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/playlists", { useNewUrlParser: true });


app.get("/playlists",function(req,res){
	res.render("playlists");
});


app.listen(3000, function(){
	console.log("The Server has started!");
});