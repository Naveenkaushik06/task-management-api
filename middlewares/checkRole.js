// Middleware to check for specific roles
const checkRole = (requiredRoles) => {
    return (req, res, next) => {
        const userRoles = req.user.roles;  // req.user is populated by token verification middleware

        // Check if the user has at least one of the required roles
        const hasRole = requiredRoles.some(role => userRoles.includes(role));

        if (!hasRole) {
            return res.status(403).json({ msg: 'Access denied: You do not have the required role' });
        }

        next();  // If the user has the role, proceed to the next middleware or route handler
    };
};

module.exports = checkRole;
