const db = require("../db-connector");

exports.convertToDesigner = async () => {
    try {
        // const result = await db.query("SELECT * FROM users WHERE email=$1", [email])
        // if(result.rows.length) {
        //     return true;
        // }
        // return false;
    } catch (e) {
        console.error('Error when converting:', e.message, e.stack);
        throw new Error('Error when converting', e);
    }
}