const userService = require("../services/user-service");

exports.getAllUsers = (req, res) => {

};

exports.getUserByEmail = async (req, res) => {
    try {

    } catch (e) {
        console.error(e);
        res.status(500).json({message: 'Internal server error', e});
    }
}

exports.createUser = async (req, res) => {
    try {
        const result = await userService.createUser(req.body);
        res.status(201).json({message: 'User created succesfully', user: result});
    } catch (e) {
        console.error('error in create user function', e);
        res.status(500).json({message: 'Internal server error', e});
    }
}