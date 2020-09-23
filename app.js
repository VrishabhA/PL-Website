let express         = require("express"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash			= require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    User 			= require("./models/user"),
    Playlist 		= require("./models/playlist"),
    Comment			= require("./models/comment"),
    app = express();

    app.locals.moment = require('moment');

let commentRoutes  = require("./routes/comments"),
	playlistRoutes = require("./routes/playlist"),
	authRoutes	   = require("./routes/index");


app.use(express.static(__dirname + "/public")); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());

app.use(require("express-session")({
    secret:"John Cena",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.warning = req.flash("warning");
    next();
});


mongoose.connect("mongodb://localhost:27017/playlists", { useNewUrlParser: true , useUnifiedTopology:true});

app.use("/", authRoutes);
app.use("/playlists", playlistRoutes);
app.use("/playlists/:id/comments",commentRoutes);

app.listen(3000, function(){
	console.log("The Server has started!");
});