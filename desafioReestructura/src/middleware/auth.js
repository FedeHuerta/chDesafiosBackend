function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

function isNotAuthenticated(req, res, next) {
    if (!req.session.user) {
        return next();
    } else {
        res.redirect('/profile');
    }
}

module.exports = {
    isAuthenticated,
    isNotAuthenticated
};
