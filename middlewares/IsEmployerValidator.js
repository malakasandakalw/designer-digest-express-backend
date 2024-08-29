const employerService = require("../services/employer-service");

module.exports = async (req, res, next) => {
    const { id } = req.user;
    if(await employerService.checkUserAvailable(id)) {
        next();
    } else {
        return res.status(403).json({ message: 'Your account cannot be found in personal accounts', status: 'error' });
    }
}