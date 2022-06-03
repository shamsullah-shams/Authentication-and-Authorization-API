const express = require("express");
const authMiddleware = require('../middleware/auth');

const router = express.Router();


router.get('/', authMiddleware.isAuth, (req, res, next) => {
    res.render('home');
});

module.exports = router;