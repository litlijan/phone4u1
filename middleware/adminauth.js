const authMiddleware = (req, res, next) => {
    if (req.session.adminLogin) {
        next();
    }
    else {
        res.redirect('/admin/')
    }
}
module.exports = { authMiddleware };