const db = require("../db-connector");
const { hashPassword } = require("../utils/password-process");

exports.checkUserAvailable = async (email) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE email=$1", [email])
        if(result.rows.length) {
            return true;
        }
        return false;
    } catch (e) {
        console.error('Error when user checking:', e.message, e.stack);
        throw new Error('Error when user checking', e);
    }
}

exports.createUser = async (userData) => {
    const { first_name, last_name, email, password } = userData;
    const hashedPassword = await hashPassword(password);

    try {
        const result = await db.query("INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *", [first_name, last_name, email, hashedPassword]);
        return result.rows[0];
    } catch (e) {
        console.error('Error creating user:', e.message, e.stack);
        throw new Error('Error creating user', e);
    }
}