const db = require("../db-connector");

exports.getAll = async () => {
    try {
        const result = await db.query("SELECT * FROM categories")
        if(result.rows.length) {
            return result.rows;
        }
    } catch (e) {
        console.error('Error when getting categories:', e.message, e.stack);
        throw new Error('Error when getting categories', e);
    }
}

exports.getById = async (id) => {
    try {
        const result = await db.query("SELECT * FROM categories WHERE id=$1", [id])
        if(result.rows.length) {
            return result.rows[0];
        }
    } catch (e) {
        console.error('Error when getting categories:', e.message, e.stack);
        throw new Error('Error when getting categories', e);
    }
}