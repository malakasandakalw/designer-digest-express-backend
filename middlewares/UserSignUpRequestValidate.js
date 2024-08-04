module.exports = (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || first_name.toString().trim() === '' || !last_name || last_name.toString().trim() === '' || !email || email.toString().trim() === '' || !password || password.toString() === '') {
        return res.status(200).json({ message: 'All fields must be fulfilled', status: 'error' });
    } else {
        next();
    }
}