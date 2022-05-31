const passport = require('passport');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

exports.getSignUp = (req, res, next) => {
    res.render('signup');
}


exports.postSignUp = (req, res, next) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.json({ message: "name and email are required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "shamsullahshamsi99@gmail.com",
            pass: "Shamsi1212"
        }
    });

    const mailOption = {
        from: "shamsullahshamsi99@gmail.com",
        to: email,
        subject: "OTP Code",
        text: `${otp} is your email verification code please very it`
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

    const { name, email, otp } = decodedToken;
    if (otp !== Number(otpCode)) {
        return res.send({ message: "OTP code is incorrect" });
    }


    const newUser = new User({ name: name, email: email, varified: true });
    await newUser.save();
    res.redirect('/signin');
}


exports.getSignIn = (req, res, next) => {
    res.render('signin');
}

exports.postSignIn = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return res.json({ message: "email is required" });
    }

    try {
        const user = await User.find({ email: email });
        if (!user) {
            return res.json({ message: "user not found" });
        }

        req.session.varified = true;
        res.redirect('/');
    } catch (error) {

    }
}
