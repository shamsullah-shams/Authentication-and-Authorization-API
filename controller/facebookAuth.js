const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../model/auth');
const passport = require('passport');

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        return cb(null, { name: "shamsullah" })
    }
));



passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
})
