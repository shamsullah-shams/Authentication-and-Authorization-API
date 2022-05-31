const express = require('express');
const passport = require('passport');
const authController = require('../controller/auth');
const authMiddleware = require('../middleware/auth');


const router = express.Router();


router.get('/signup', authMiddleware.isNotAuth, authController.getSignUp);
router.post('/signup', authMiddleware.isNotAuth, authController.postSignUp);
router.get('/signin', authMiddleware.isNotAuth, authController.getSignIn);
router.post('/signin', authMiddleware.isNotAuth, authController.postSignIn);
router.post('/verifyEmail', authMiddleware.isNotAuth, authController.postVarifyEmail)
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }), (req, res, next) => {
    console.log(req.body);
});

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        console.log(req.body);
        res.redirect('/');
    }
);



module.exports = router;