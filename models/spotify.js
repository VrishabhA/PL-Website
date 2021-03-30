let mongoose = require("mongoose");

var spotifySchema = new mongoose.Schema({
    token: {
        accessToken: String,
        refreshToken: String,
        maxAge: Number,
    },
    account: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Spotify", spotifySchema);