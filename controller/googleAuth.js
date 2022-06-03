const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Auth = require('../model/auth');
const passport = require('passport');
const mongoose = require('mongoose');
const req = require('express/lib/request');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true,
},
    async function (request, accessToken, refreshToken, profile, done) {
        let newUser;
        try {
            const auth = await Auth.findOne({ email: profile.emails[0].value });
            if (!auth) {
                newUser = new Auth({
                    email: profile.emails[0].value,
                    varified: true,
                });
                const result = await newUser.save();
                profile.status = "new";
                return done(null, profile);
            }
            return done(null, auth);

        } catch (error) {
            done(error, profile);
        }
    }
));


passport.serializeUser(function (user, done) {
    done(null, user);
});


passport.deserializeUser((user, done) => {
    done(null, user);
})