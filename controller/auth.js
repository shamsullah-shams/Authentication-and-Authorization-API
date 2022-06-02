const passport = require('passport');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

exports.getSignUp = (req, res, next) => {
    res.render('signup');
}


exports.postSignUp = (req, res, next) => {
    const { name, email, roll } = req.body;
    console.log(roll);

    if (!name || !email) {
        return res.json({ message: "name and email are required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

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
        subject: "OTP Code",
        text: `<h1>${otp} is your email verification code please very it</h1>`
    }

    try {
        transport.sendMail(mailOption, (error, info) => {
            if (error) {
                return console.log(error);
            }
        })
    } catch (error) {

    }

    const token = jwt.sign({
        name: name,
        email: email,
        roll: roll,
        otp: otp,
    }, process.env.SECRET, { expiresIn: '1h' });

    req.session.token = token;
    return res.render('verify');
}

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

    const { name, email, otp, roll } = decodedToken;
    if (otp !== Number(otpCode)) {
        return res.send({ message: "OTP code is incorrect" });
    }


    const newUser = new User({ name: name, email: email, varified: true, roll: roll });
    await newUser.save();
    res.redirect('/signin');
}


exports.getSignIn = (req, res, next) => {
    res.render('signin');
}

exports.postSignIn = async (req, res, next) => {

    if (req.session.passport) {
        req.session.user = req.session.passport.user;
        return res.redirect('/');
    }

    const { email } = req.body;
    if (!email) {
        return res.json({ message: "email is required" });
    }

    try {
        const user = await User.find({ email: email });
        if (!user) {
            return res.json({ message: "user not found" });
        }

        req.session.user = user;
        res.redirect('/');
    } catch (error) {

    }
}


exports.authSuccess = (req, res, next) => {
    if (!req.user.status) {
        req.session.user = req.user;
        return res.redirect('/');
    }
    res.redirect('/signin');
}


exports.authFailer = (req, res, next) => {
    res.redirect('/signup');
}