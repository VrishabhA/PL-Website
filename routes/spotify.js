const { access } = require("fs");
const { type } = require("os");
const { db } = require("../models/spotify");

let express = require("express"),
    axios = require("axios"),
    cookieParser = require('cookie-parser'),
    cors = require('cors'),
    queryString = require('querystring'),
    router = express.Router({ mergeParams: true }),
    Spotify = require("../models/spotify"),
    middleware = require("../middleware");

require('dotenv').config();

var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
var redirect_uri = 'http://localhost:8888/spotifyAuth/callback';
var stateKey = "spotify_auth_state";


router.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());









router.get('/login', function (req, res) {
    var scope = 'user-read-private user-read-email playlist-modify-public playlist-read-private';
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    res.redirect('https://accounts.spotify.com/authorize?' +
        queryString.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});




router.get("/callback", function (req, res) {

    const code = req.query.code || null
    const state = req.query.state || null
    const storedState = req.cookies ? req.cookies[stateKey] : null

    if (state === null || state !== storedState) {
        res.redirect('/#' + queryString.stringify({
            error: 'state_mismatch'
        }))
        return;
    }

    res.clearCookie(stateKey)

    axios({
        url: 'https://accounts.spotify.com/api/token',
        method: 'post',
        params: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
            username: client_id,
            password: client_secret
        }
    }).then(response => {
        console.log(response)

        const accessToken = response.data.access_token,
            refreshToken = response.data.refresh_token,
            expiresIn = response.data.expires_in;

        var newToken = new Spotify({
            token: {
                accessToken: accessToken,
                refreshToken: refreshToken,
                maxAge: expiresIn,
            },
            account: req.user.username,
        });

        Spotify.create(newToken, function (err, token) {
            if (err) {
                req.flash("error", err);
                res.redirect("/#");
            } else {
                token.account.id = req.user._id;
                token.account.username = req.user.username;
                token.save();

                console.log("--------------------------------------------------------------------------------");
                console.log("Token Created: " + token);
            }
        });


    }).catch(err => {
        res.redirect('/#' + queryString.stringify({
            error: 'invalid token'
        }))
        console.log(err)
    })
});


// app.get('/refresh_token', function (req, res) {
//     var refresh_token = req.query.refresh_token;

//     axios({
//         url: 'https://accounts.spotify.com/api/token',
//         method: 'post',
//         params: {
//             grant_type: 'refresh token',
//             refresh_token: refresh_token,
//         },
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         auth: {
//             username: client_id,
//             password: client_secret
//         }
//     }).then(function () {
//         var access_token = body.accessToken;
//         res.send({ 'access_token': access_token });
//     }).catch(error => console.log(error))
// });



router.get('/display', function (req, res) {

    var accessToken = "";

    Spotify.find({ 'account.id': req.user._id }, function (err, spotify) {
        if (err) {
            req.flash("error", err);
        } else {
            console.log(spotify)
            spotify.forEach((data) => {
                accessToken = data.token.accessToken;
            });
            axios({
                url: 'https://api.spotify.com/v1/me/playlists',
                method: 'get',
                params: {
                    limit: 5
                },
                headers: {
                    Authorization: 'Bearer ' + accessToken
                }
            }).then(response => {
                console.log("--------------------------------------------------------------------------------");
                response.data.items.map(function (item) {
                    console.log(item.name);
                });
            }).catch(err => {
                console.log(err);
            });
        }

    });


});


var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

module.exports = router;
