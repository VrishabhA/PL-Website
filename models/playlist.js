let mongoose = require("mongoose");

var playlistSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	URL: String,
	eUrl: String,
	playlist_id: String,
	createdAt: { type: Date, default: Date.now },
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}]
});

module.exports = mongoose.model("Playlist", playlistSchema);