const userService = require("../services/user-service");

module.exports = async (req, res, next) => {
    const { email } = req.body;
    if(await userService.checkUserAvailable(email)) {
        return res.status(403).json({ message: 'Email already exists' });
    } else {
        next();
    }
}