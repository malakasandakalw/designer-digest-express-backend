const db = require("../db-connector");

exports.getAll = async () => {
    try {
        const result = await db.query("SELECT * FROM designer_categories ORDER BY name ASC")
        if(result.rows.length) {
            return result.rows;
        }
        return []
    } catch (e) {
        console.error('Error when getting designer categories:', e.message, e.stack);
        throw new Error('Error when getting designer categories', e);
    }
}