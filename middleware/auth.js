exports.isAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/signin');
    }
    next();
}


exports.isNotAuth = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
}


exports.isDoctor = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/signin');
    }
    if (req.session.user[0].roll === "Doctor") {
        next();
    }
    res.redirect('/');
}


exports.isClinic = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/signin');
    }
    if (req.session.user[0].roll === "Doctor" || req.session.user[0].roll === "Clinic") {
        next();
    }
    return res.redirect('/');
}