const passport = require('passport');
const Auth = require('../model/auth');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { ResultWithContext } = require('express-validator/src/chain');

// Make OTP and Return it
const makeOTPToken = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

// @@ return sing up page
exports.getSignUp = (req, res, next) => {
    res.render('signup');
}

exports.getResetPasswordPage = (req, res, next) => {
    res.render('resetpassword');
}

// @@ return sing in page
exports.getSignIn = (req, res, next) => {
    res.render('signin');
}


// @@ Get Email and Send varification Code 
exports.postResetPassword = async (req, res, next) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        const errors = validationError.array().map(eO => {
            return eO.msg;
        })
        return res.status(422).send(errors);
    }
    const { email } = req.body;
    try {
        const auth = await Auth.findOne({ email: email });
        if (!auth) {
            return res.send('Email Not Found');
        }
        const otp = makeOTPToken();
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "shamsullahshamsi99@gmail.com",
                pass: "Shamsi12123"
            }
        });
        const mailOption = {
            from: "shamsullahshamsi99@gmail.com",
            to: email,
            subject: "Verification Code",
            text: `${otp} is your email verification code please very it`
        }

        try {
            await transport.sendMail(mailOption);
        } catch (error) {
            return res.json({ error: error });
        }

        const token = jwt.sign({
            email: email,
            otp: otp,
        }, process.env.SECRET, { expiresIn: '1h' });

        req.session.token = token;
        return res.render('verifyresetPasswort');
    } catch (error) {
        res.status(500).json({ error });
    }
}


// @@ get OTP and Reset Password 

exports.varifyresetpassword = (req, res, next) => {

    const { otpCode } = req.body;
    const token = req.session.token;
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET);
    } catch (error) {
        return res.send(error);
    }

    if (!decodedToken) {
        return res.send('Not Authorized');
    }
    const { email, otp } = decodedToken;
    if (otp !== Number(otpCode)) {
        return res.send({ message: "OTP code is incorrect" });
    }

    return res.render('newPassword');
}

// @@ get New Password and Reset into the DataBase

exports.newPassword = async (req, res, next) => {

    let decodedToken;
    const token = req.session.token;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET);
    } catch (error) {
        return res.send(error);
    }


    if (!decodedToken) {
        return res.send('Not authorized');
    }

    const { email } = decodedToken;
    const { newpassword } = req.body;
    try {
        const hashPassword = await bcrypt.hash(newpassword, 12);
        await Auth.findOneAndUpdate({ email: email }, { $set: { password: hashPassword } });
        return res.redirect('/signin');

    } catch (error) {
        console.log('error block');
        console.log(error);
    }

}


// @@ get data from sign up page and send email to user
exports.postSignUp = async (req, res, next) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        const errors = validationError.array().map(eO => {
            return eO.msg;
        })
        return res.status(422).send(errors);
    }

    const { email, password } = req.body;
    const auth = await Auth.findOne({ email: email });
    if (auth) {
        return res.json({ message: "Email already exist" });
    }
    const otp = makeOTPToken();

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "shamsullahshamsi99@gmail.com",
            pass: "Shamsi12123"
        }
    });

    const mailOption = {
        from: "shamsullahshamsi99@gmail.com",
        to: email,
        subject: "Verification Code",
        text: `${otp} is your email verification code please very it`
    }

    try {
        await transport.sendMail(mailOption);
    } catch (error) {
        return res.json({ error: error });
    }

    const token = jwt.sign({
        email: email,
        password: password,
        otp: otp,
    }, process.env.SECRET, { expiresIn: '1h' });

    req.session.token = token;
    return res.render('verify');
}


// @@ get varify code from user and save the user in database,
exports.postVarifyEmail = async (req, res, next) => {
    const { otpCode } = req.body;

    const token = req.session.token;
    let decodedToken
    try {
        decodedToken = jwt.verify(token, process.env.SECRET)
    } catch (error) {
        return res.send(error);
    }

    if (!decodedToken) {
        return res.send('Not Authorized');
    }

    const { email, otp, password } = decodedToken;
    if (otp !== Number(otpCode)) {
        return res.send({ message: "OTP code is incorrect" });
    }

    try {
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new Auth({ email: email, password: hashPassword, varified: true, });
        await newUser.save();
        res.redirect('/signin');
    } catch (error) {
        return res.status(500).json({ error: error })
    }

}


//  @@ get data from sign in page validating and saving in session
exports.postSignIn = async (req, res, next) => {

    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        const errors = validationError.array().map(eO => {
            return eO.msg;
        })
        return res.status(422).send(errors);
    }

    if (req.session.passport) {
        req.session.user = req.session.passport.user;
        return res.redirect('/');
    }

    const { email, password } = req.body;

    try {
        const user = await Auth.findOne({ email: email });
        if (!user) {
            return res.json({ message: "Email Not found" });
        }
        const doMatch = await bcrypt.compare(password, user.password);
        if (!doMatch) {
            return res.json({ message: "Password is wrong" });
        }
        req.session.user = user;
        res.redirect('/');
    } catch (error) {

    }
}

// @@ success google and facebook auths
exports.authSuccess = (req, res, next) => {
    if (!req.user.status) {
        req.session.user = req.user;
        return res.redirect('/');
    }
    res.redirect('/signin');
}



// @@ failure google and facebook auths
exports.authFailer = (req, res, next) => {
    res.redirect('/signup');
}