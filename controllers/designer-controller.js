exports.createPost = async (req, res) => {
    try {
        const result = await userService.createUser(req.body);
        res.status(200).json({ message: 'User created succesfully', user: result, status: 'success' });
    } catch (e) {
        console.error('error in create user function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}