const db = require("../db-connector");

exports.checkUserAvailable = async (id) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE id=$1 AND user_role=(SELECT id FROM user_roles WHERE key='EMPLOYER')", [id])
        if (result.rows.length) return true;
        return false;
    } catch (e) {
        console.error('Error when checking DESIGNER aacounts:', e.message, e.stack);
        throw new Error('Error when checking DESIGNER aacounts', e);
    }
}