exports.isAuth = (req, res, next) => {
    const varified = req.session.varified;

    if (!varified) {
        return res.redirect('/signin');
    }
    next();
}


exports.isNotAuth = (req, res, next) => {
    const varified = req.session.varified;

    if (varified) {
        return res.redirect('/');
    }

    next();
}