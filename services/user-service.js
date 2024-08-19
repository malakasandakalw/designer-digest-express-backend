const db = require("../db-connector");
const { hashPassword, comparePassword } = require("../utils/password-process");

exports.getAllUsers = async() => {
    try {
        const result = await db.query("SELECT id, first_name, last_name, email, (SELECT value FROM user_roles WHERE id=users.user_role) as role, profile_picture FROM users ORDER BY first_name")
        if(result.rows) {
            return result.rows;
        }
    } catch (e) {
        console.error('Error when getting users:', e.message, e.stack);
        throw new Error('Error when getting users', e);
    }
}

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

exports.getUserbyId = async (userId) => {
    const user = await getUserDataById(userId);
    if(user) {
        const data = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            is_verified: user.is_verified,
            profile_picture: user.profile_picture,
            role: user.role,
            phone: user.phone
        }
        return data;
    } else {
        return null;
    }

}

async function getUserByEmail(email) {
    try {
        const result = await db.query('SELECT id, first_name, last_name, email, password, profile_picture, phone, is_verified,(SELECT value FROM user_roles WHERE user_roles.id=users.user_role) as role FROM users WHERE email=$1', [email]);
        if(result.rows) {
            return result.rows[0];
        }
        return null;
    } catch(e) {
        console.error('Error user finding:', e.message, e.stack);
        throw new Error('Error user finding', e);
    }
}

async function getUserDataById(id) {
    try {
        const result = await db.query('SELECT id, first_name, last_name, email, password, profile_picture, phone, is_verified,(SELECT value FROM user_roles WHERE user_roles.id=users.user_role) as role FROM users WHERE id=$1', [id]);
        if(result.rows) {
            return result.rows[0];
        }
        return null;
    } catch(e) {
        console.error('Error user finding:', e.message, e.stack);
        throw new Error('Error user finding', e);
    }
}