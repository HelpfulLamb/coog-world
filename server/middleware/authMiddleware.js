const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        const bearerToken = token.split(' ')[1];
        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); 
            }
            req.user = user; 
            next();
        });
    } else {
        res.sendStatus(401); 
    }
};

module.exports = authenticateJWT;