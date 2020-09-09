let express     = require("express"),
    router      =  express.Router({mergeParams: true}),
    Playlist  = require("../models/playlist"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Playlist.findById(req.params.id,function(err, playlist){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new",{playlist: playlist});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){

    var newComment = new Comment({ text: req.body.text, author: req.user.username });
    Playlist.findById(req.params.id,function(err, playlist){
        if(err){
            console.log(err);
        }else{
            Comment.create(newComment,function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    
                    comment.author.username = req.user.username;
                    console.log(comment.author.username);
                    console.log(req.user.username);
                    comment.author.id = req.user._id;
                    comment.save();

                    playlist.comments.push(newComment);
                    playlist.save();
                    res.redirect("/playlists/"+playlist.id);
                    // console.log(playlist);
                    // console.log(req.body);
                    // console.log(req.body.comment);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req,res){
    Comment.findById(req.params.comment_id, function(err,comment){
        if(err){
            console.log(err);
        }else{
            res.render("comments/edit",{comment: comment, playlist_id : req.params.id});
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwner, function(req,res){
    Comment.findOneAndUpdate({_id: req.params.comment_id}, req.body.comment, {useFindAndModify: false}).exec(function(err,updatedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/playlists/"+req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwner, function(req,res){
    Comment.findOneAndDelete({_id: req.params.comment_id}).exec(function(err,deletedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/playlists/"+req.params.id)
        }
    });
});




module.exports = router ;