const personalService = require("../services/personal-service")

exports.convertToDesigner = async (req, res) => {
    try {
        const userId = req.user.id;
        const {location, categories} = req.body;
        const result = await personalService.convertToDesigner(userId, location, categories);
        if(result) return res.status(200).json({ message: 'Converted succesfully', body: { converted: result}, status: 'success' });
        return res.status(200).json({ message: 'Conversion failed. Try again later!', body: { converted: result}, status: 'error' });
    } catch (e) {
        console.error('error in create user function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}