const db = require("../db-connector");

exports.checkUserAvailable = async (id) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE id=$1 AND user_role=(SELECT id FROM user_roles WHERE key='DESIGNER')", [id])
        if (result.rows.length) return true;
        return false;
    } catch (e) {
        console.error('Error when checking DESIGNER aacounts:', e.message, e.stack);
        throw new Error('Error when checking DESIGNER aacounts', e);
    }
}

exports.getAllDesigners = async() => {
    try {
        const result = await db.query("SELECT id, first_name, last_name, email, (SELECT value FROM user_roles WHERE id=users.user_role) as role, profile_picture FROM users WHERE user_role=(SELECT id FROM user_roles WHERE key='DESIGNER') ORDER BY first_name")
        if(result.rows) {
            return result.rows;
        }
    } catch (e) {
        console.error('Error when getting users:', e.message, e.stack);
        throw new Error('Error when getting users', e);
    }
}