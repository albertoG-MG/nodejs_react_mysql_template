const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.sendStatus(401);

    jwt.verify(token, process.env.AUTH_SECRET_KEY, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;