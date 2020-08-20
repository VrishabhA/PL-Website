let express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    Playlist= require("../models/playlist");
    User= require("../models/user");


router.get("/", function(req,res){
	res.render("landing");
});


// Auth Routes
router.get("/register",function(req,res){
	res.render("register",{message: false});
});

router.post("/register",function(req,res){
	var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            res.render("register",{message: req.flash("error")});
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/playlists");
        });
    });
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local",{
    successRedirect:"/playlists",
    failureRedirect: "/login",
    failureFlash : true
}), function(req,res,next){

});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


module.exports = router;