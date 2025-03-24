const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        // Remove "Bearer " prefix if present
        const bearerToken = token.split(' ')[1];
        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            req.user = user; // Attach user info to request
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};

module.exports = authenticateJWT;