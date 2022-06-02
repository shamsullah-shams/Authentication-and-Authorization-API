const express = require("express");
const authMiddleware = require('../middleware/auth');

const router = express.Router();


router.get('/', authMiddleware.isAuth, (req, res, next) => {
    res.render('home');
});
router.get('/patients', (req, res, next) => {
    return res.render('patients');
});
router.get('/doctors', authMiddleware.isDoctor, (req, res, next) => {
    return res.render('doctors');
});
router.get('/clinic', authMiddleware.isClinic, (req, res, next) => {
    return res.render('clinic');
});


module.exports = router;