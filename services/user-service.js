const db = require("../db-connector");
const { hashPassword, comparePassword } = require("../utils/password-process");

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
        const result = await db.query("INSERT INTO users (first_name, last_name, email, password, user_role) VALUES ($1, $2, $3, $4, (SELECT id FROM user_roles WHERE key='PERSONAL')) RETURNING *", [first_name, last_name, email, hashedPassword]);
        const user = result.rows[0]
        // if(user) {
        //     user.role_name = 'Personal'
        // }
        return user;
    } catch (e) {
        console.error('Error creating user:', e.message, e.stack);
        throw new Error('Error creating user', e);
    }
}

exports.authenticate = async (email, password) => {

    const user = await getUserByEmail(email);
    const passwordValidate = await comparePassword(password, user.password);

    if(passwordValidate) {
        return user;
    } else {
        return null;
    }

}

async function getUserByEmail (email) {
    try {
        const result = await db.query('SELECT id, first_name, last_name, email, password, is_verified,(SELECT value FROM user_roles WHERE user_roles.id=users.user_role) as role FROM users WHERE email=$1', [email]);
        if(result.rows) {
            return result.rows[0];
        }
        return null;
    } catch(e) {
        console.error('Error user finding:', e.message, e.stack);
        throw new Error('Error user finding', e);
    }
}