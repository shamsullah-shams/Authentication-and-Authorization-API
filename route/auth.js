const express = require('express');
const { redirect } = require('express/lib/response');
const passport = require('passport');
const authController = require('../controller/auth');
const authMiddleware = require('../middleware/auth');


const router = express.Router();


router.get('/signup', authMiddleware.isNotAuth, authController.getSignUp);
router.post('/signup', authMiddleware.isNotAuth, authController.postSignUp);
router.get('/signin', authMiddleware.isNotAuth, authController.getSignIn);
router.post('/signin', authMiddleware.isNotAuth, authController.postSignIn);
router.post('/verifyEmail', authMiddleware.isNotAuth, authController.postVarifyEmail);
router.get('/signin/with/google', authMiddleware.isNotAuth, authController.postSignIn);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/success', authController.authSuccess);
router.get('/auth/fail', authController.authFailer);
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/fail', successRedirect: "/auth/success" }));
router.get('/auth/facebook',
    passport.authenticate('facebook', { authType: 'reauthenticate', scope: ['user_friends', 'manage_pages'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: "/signup", successRedirect: "/signin" }));




module.exports = router;