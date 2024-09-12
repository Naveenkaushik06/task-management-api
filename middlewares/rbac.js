// middlewares/rbac.js

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        console.log("role  is: " + roles);
        console.log("roles is : "+req.user.role);
        
        if (!req.user || !roles.includes(req.user.role)) {
            console.log('Access denied');
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};

