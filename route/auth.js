const express = require('express');
const passport = require('passport');
const authController = require('../controller/auth');
const authMiddleware = require('../middleware/auth');
const { body } = require('express-validator');
const Auth = require('../model/auth');
const router = express.Router();



// @@ get methods routes
router.get('/signup', authMiddleware.isNotAuth, authController.getSignUp);
router.get('/signin', authMiddleware.isNotAuth, authController.getSignIn);
router.get('/auth/success', authController.authSuccess);
router.get('/auth/fail', authController.authFailer);
router.get('/resetpassword', authController.getResetPasswordPage);




// @@ validating signup route
router.post('/signup', [
    body('email')
        .trim()
        .isEmail()
        .withMessage('please enter a vilid email')
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('please enter 8 charactor long password'),
], authMiddleware.isNotAuth, authController.postSignUp);


// @@ get email and check to reset password
router.post('/resetpassword', [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please Enter a valid Email')
        .normalizeEmail(),
], authController.postResetPassword);

// @@ get OTP code and Reset Password 
router.post('/varifyresetpassword', authController.varifyresetpassword);

// @@ 

router.post('/newpassword', authController.newPassword);


// @@ validating sign in route
router.post('/signin', [
    body('email')
        .trim()
        .isEmail()
        .withMessage('please enter a vilid email')
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('please enter 8 charactor long password'),
], authMiddleware.isNotAuth, authController.postSignIn);




// @@ Get OTP and Verify Email
router.post('/verifyEmail', authMiddleware.isNotAuth, authController.postVarifyEmail);

// @@ Goooooogle Authentication routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/fail', successRedirect: "/auth/success" }));


// @@ Facebook Authentication routes
router.get('/auth/facebook',
    passport.authenticate('facebook', { authType: 'reauthenticate', scope: ['user_friends', 'manage_pages'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: "/signup", successRedirect: "/signin" }));




module.exports = router;