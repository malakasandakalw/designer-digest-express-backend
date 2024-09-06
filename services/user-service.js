const db = require("../db-connector");
const { hashPassword, comparePassword } = require("../utils/password-process");

exports.getAllUsers = async() => {
    try {
        const result = await db.query("SELECT id, first_name, last_name, email, (SELECT value FROM user_roles WHERE id=users.user_role) as role, profile_picture FROM users ORDER BY first_name")
        if(result.rows) {
            return result.rows;
        }
        return []
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

exports.updatePassword = async (userId, newPasword) => {
    const hashedPassword = await hashPassword(newPasword);
    try {
        const result = await db.query("UPDATE users SET password=$2 WHERE id=$1", [userId, hashedPassword]);

        if(result.rows) {
            return true
        } 

        return false

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

exports.passwordValidate = async (userId, currentPassword) => {
    try {
        const password = await db.query('SELECT password FROM users WHERE id=$1', [userId])

        if(password.rows) {

            const passwordValidate = await comparePassword(currentPassword, password.rows[0].password);

            if(passwordValidate) {
                return true
            } 
            
            return false;

        }

        return null

    } catch (e) {
        console.error('Error updating password:', e.message, e.stack);
        throw new Error('Error updating password', e); 
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
            phone: user.phone,
            email: user.email
        }
        return data;
    } else {
        return null;
    }

}



exports.update = async (userId, first_name, last_name, profile_picture, phone) => {
    try {
        const result = await db.query("UPDATE users SET first_name=$2, last_name=$3, profile_picture=$4, phone=$5 WHERE users.id=$1", [userId, first_name, last_name, profile_picture, phone])
        if (result) {
            return true
        }
        return false
    } catch (e) {
        console.error('Error when profile:', e.message, e.stack);
        throw new Error('Error when profile', e);        
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