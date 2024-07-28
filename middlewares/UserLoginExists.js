const userService = require("../services/user-service");

module.exports = async (req, res, next) => {
    const { email } = req.body;
    if(await userService.checkUserAvailable(email)) {
        next();
    } else {
        return res.status(200).json({ message: 'Email cannot be found', status: 'error' });
    }
}