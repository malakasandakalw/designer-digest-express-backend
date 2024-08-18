const personalService = require("../services/personal-service")
const userService = require("../services/user-service")

exports.updateProfile =  async (req, res) => {
    try {
        const userId = req.user.id;
        const {first_name, last_name, profile_picture, phone } = req.body;
        const result = await personalService.updateProfile(userId, first_name, last_name, profile_picture, phone);
        const userData = await userService.getUserbyId(userId)
        if(result && userData) return res.status(200).json({ message: 'Profile updated succesfully.', body: { user: userData }, status: 'success' });
        return res.status(200).json({ message: 'Update failed. Try again later!', body: { user: userData}, status: 'error' });
    } catch (e) {
        console.error('error in create user function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}


exports.convertToDesigner = async (req, res) => {
    try {
        const userId = req.user.id;
        const {location, categories} = req.body;
        const result = await personalService.convertToDesigner(userId, location, categories);
        if(result) return res.status(200).json({ message: 'Converted succesfully. You will logout from your current session. Please login again', body: { converted: result}, status: 'success' });
        return res.status(200).json({ message: 'Conversion failed. Try again later!', body: { converted: result}, status: 'error' });
    } catch (e) {
        console.error('error in create user function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}

exports.convertToEmployer = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await personalService.convertToEmployer(userId);
        if(result) return res.status(200).json({ message: 'Converted succesfully. You will logout from your current session. Please login again', body: { converted: result}, status: 'success' });
        return res.status(200).json({ message: 'Conversion failed. Try again later!', body: { converted: result}, status: 'error' });
    } catch (e) {
        console.error('error in create user function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}