const personalService = require("../services/personal-service")

exports.convertToDesigner = async (req, res) => {
    try {
        const result = await personalService.convertToDesigner(req.body);
        res.status(200).json({ message: 'Converted succesfully', user: result, status: 'success' });
    } catch (e) {
        console.error('error in create user function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}