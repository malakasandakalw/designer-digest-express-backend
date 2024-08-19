const userService = require("../services/user-service");
const jwt = require('jsonwebtoken');
const secretKey = 'backend_secret_key';

exports.getAllUsers = async (req, res) => {
    try {
        const result = await userService.getAllUsers()
        if(result) return res.status(200).json({ message: 'Users fetching success', body: result, status: 'success' });
        return res.status(200).json({ message: 'Users fetching failed', body: [], status: 'error' });
    } catch (e) {
        console.error('error in get all users function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}

exports.getById = async (req, res) => {
    try {
        const id = req.query.receiverId
        if(!id) return res.status(200).json({ message: 'Data error', body: [], status: 'error' });

        const result = await userService.getUserbyId(id)
        if(result) return res.status(200).json({ message: 'User fetching success', body: result, status: 'success' });
        return res.status(200).json({ message: 'User fetching failed', body: [], status: 'error' });
    } catch (e) {
        console.error('error in get user by id function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });        
    }
}

exports.getUserByEmail = async (req, res) => {
    try {

    } catch (e) {
        console.error(e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error' });
    }
}

exports.createUser = async (req, res) => {
    try {
        const result = await userService.createUser(req.body);
        res.status(200).json({ message: 'User created succesfully', user: result, status: 'success' });
    } catch (e) {
        console.error('error in create user function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}

exports.verify = async (req, res) => {
    try {
        res.status(200).json({ message: 'User verified', verified: true, status: 'success' });
    } catch (e) {
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await userService.authenticate(email, password);
        if (user) {
            const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "24h" });
            res.status(200).json({ message: "Login success", body: {token, user}, status: 'success' })
        } else {
            res.status(200).json({ message: 'Wrong credentials', status: 'error' })
        }
    } catch (e) {
        console.error('error in login function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error' });
    }
}