const Doctor = require('../model/doctor');
const Patient = require('../model/patient');
const Clinic = require('../model/clinic');

// @@ check if the user Authorized
exports.isAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/signin');
    }
    next();
}


// @@ check if the user is not Authorized
exports.isNotAuth = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
}

// @@ check if the user has a Doctor roll in the database
exports.isDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.find({ authId: req.session.user._id });
        if (doctor.toString() !== [].toString()) {
            return res.json({ message: "your are Doctor" });
        }
    } catch (error) {
        return next(error);
    }
    next();
}

// @@ check if the user has Clinic Person roll in the database,
exports.isClinic = async (req, res, next) => {
    try {
        const clinic = await Clinic.find({ authId: req.session.user._id });
        if (clinic.toString() !== [].toString()) {
            return res.json({ message: "your are Clinic person" });
        }
    } catch (error) {
        return next(error);
    }
    next();
}

// @@ check if the user has a patient roll in the database,
exports.isPatient = async (req, res, next) => {
    try {
        const patient = await Patient.find({ authId: req.session.user._id });
        if (patient.toString() !== [].toString()) {
            return res.json({ message: "your are patient" });
        }
    } catch (error) {
        return next(error);
    }
    next();
}