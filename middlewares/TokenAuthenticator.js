const jwt = require('jsonwebtoken');
const secretKey = 'backend_secret_key';

module.exports = async (req, res, next) => {
    const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
    if(!token) return res.status(403).json({ message: 'Unauthorized token', status: 'error' });

    jwt.verify(token, secretKey, (e, user) => {
        if(e) return res.status(403).json({message: 'Internal server error', e});
        req.user = user;
        next();
    })

}