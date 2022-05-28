const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// let port = 8888;

app.use(cors({
    origin: "*"

}));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send("hi3");
})

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
        clientId: 'c358a6d11119494fb227b7e5aba6be5f',
        clientSecret: '38c4baa61d4e4fda8daef7624d6f593d',
        redirectUri: process.env.URL_WEBSITE,
        refreshToken,
    });

    spotifyApi.refreshAccessToken()
        .then((data) => {
            console.log("refresh vo day");
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in,

            })
        }

        )
        .catch((err) => {
            console.log('Something went wrong refresh!', err);
        })
})

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        clientId: 'c358a6d11119494fb227b7e5aba6be5f',
        clientSecret: '38c4baa61d4e4fda8daef7624d6f593d',
        redirectUri: process.env.URL_WEBSITE,
    });

    spotifyApi.authorizationCodeGrant(code)
        .then((data) => {
            console.log("login vo day");
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,

            })
        })
        .catch((err) => {
            console.log('Something went wrong login!', err);
            console.log(code);
        })
})




app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})