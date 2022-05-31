const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const authRoutes = require('./route/auth');
const homeRoutes = require('./route/home');
const session = require('express-session');
const passport = require('passport');
const { default: mongoose } = require('mongoose');


require('dotenv').config();
require('./controller/googleAuth');

const MONGODB_URL = 'mongodb://localhost:27017/Auth_API'

const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'MY LONG SECRET'
}));
app.set('view engine', 'ejs')




app.use(homeRoutes);
app.use(authRoutes);


mongoose.connect(MONGODB_URL, (err) => {
    if (err) {
        return console.log(err);
    }
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    })
})