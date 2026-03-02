const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).send({
            auth: false,
            message: "Require Admin Role"
        });
    }
    next();
};

module.exports = isAdmin;