const Doctor = require('../model/doctor');
const Patient = require('../model/patient');
const Clinic = require('../model/clinic');
const { validationResult } = require('express-validator');

// @@ return a doctor page to the user
exports.getDoctor = (req, res, next) => {
    res.render('doctor');
}


// @@ return a patient page to the user
exports.getPatient = (req, res, next) => {
    res.render('patient');
}


// @@ return a clinic page to the user
exports.getClinic = (req, res, next) => {
    res.render('clinic');
}


// @@ save the doctor information in to the Database
exports.postDoctor = async (req, res, next) => {
    const validationError = validationResult(req);
    if (validationError.isEmpty()) {
        const errors = validationError.array().map(eO => {
            return eO.msg;
        })
        return res.status(422).send(errors);
    }
    const { fullName, dateOfBirth, gender, bloodGroup, location } = req.body;
    const newDoctor = new Doctor({
        fullName: fullName,
        dateOfBirth: dateOfBirth,
        gender: gender,
        bloodGroup: bloodGroup,
        location: location,
        authId: req.session.user._id
    });
    await newDoctor.save();
    res.redirect('/');
}

// @@ save the patient information in to the Database
exports.postPatient = async (req, res, next) => {

    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        const errors = validationError.array().map(eO => {
            return eO.msg;
        })
        return res.status(422).send(errors);
    }

    const { fullName, dateOfBirth, gender, bloodGroup, location } = req.body;
    const newPatient = new Patient({
        fullName: fullName,
        dateOfBirth: dateOfBirth,
        gender: gender,
        bloodGroup: bloodGroup,
        location: location,
        authId: req.session.user._id
    });

    await newPatient.save();
    res.redirect('/');
}



// @@ save the clinic information in to the Database
exports.postClinic = async (req, res, next) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        const errors = validationError.array().map(eO => {
            return eO.msg;
        })
        return res.status(422).send(errors);
    }
    const { fullName, location } = req.body;
    const newClinic = new Clinic({
        fullName: fullName,
        location: location,
        authId: req.session.user._id
    });
    await newClinic.save();
    res.redirect('/');
}