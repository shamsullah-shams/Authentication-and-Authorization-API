const express = require('express');
const userController = require('../controller/user');
const router = express.Router();
const { body } = require('express-validator');
const auhtMiddleware = require('../middleware/auth');


// @@ get doctor, patient and clinic routes
router.get('/doctor', userController.getDoctor);
router.get('/patient', userController.getPatient);
router.get('/clinic', userController.getClinic);


// @@ validating post doctor route
router.post('/doctor',
    auhtMiddleware.isAuth,
    auhtMiddleware.isDoctor,
    auhtMiddleware.isPatient,
    auhtMiddleware.isClinic,
    [
        body('fullName').trim().isLength({ min: 6 }),
        body('date').trim().isDate(),
        body('gender').trim().isLength({ min: 3 })
    ], userController.postDoctor);



// @@ validating post patient route
router.post('/patient',
    auhtMiddleware.isAuth,
    auhtMiddleware.isDoctor,
    auhtMiddleware.isPatient,
    auhtMiddleware.isClinic,
    [
        body('fullName').trim().isLength({ min: 6 }),
        body('date').trim().isDate(),
        body('gender').trim().isLength({ min: 3 })
    ], userController.postPatient);



// @@ validating post clinic route
router.post('/clinic',
    auhtMiddleware.isAuth,
    auhtMiddleware.isDoctor,
    auhtMiddleware.isPatient,
    auhtMiddleware.isClinic,
    [
        body('location').trim().isLength({ min: 3 }),
        body('fullName').trim().isLength({ min: 6 }),
    ], userController.postClinic);





module.exports = router;