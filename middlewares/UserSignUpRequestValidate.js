module.exports = (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || first_name.trim() === '' || !last_name || last_name.trim() === '' || !email || email.trim() === '' || !password || password === '') {
        return res.status(400).json({ message: 'All fields must be fulfilled' });
    } else {
        next();
    }
}