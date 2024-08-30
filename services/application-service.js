const db = require("../db-connector");

exports.createApplication = async (userId, files, vacancyId) => {
    try {
        const result = await db.query("INSERT INTO applications(applicant_id, vacancy_id, resume_url) VALUES ($1, $2, $3) returning applications.id", [userId, vacancyId, files])
        if (result.rows.length) {
            return result.rows[0].id
        }
        return null
    } catch (e) {
        console.error('Error when creating vacancy:', e.message, e.stack);
        throw new Error('Error when creating vacancy', e)
    }
}

exports.updateApplication = async (files, applicationId) => {
    try {
        const result = await db.query("UPDATE applications SET resume_url=$2 WHERE id=$1", [applicationId, files])
        if (result) {
            return true
        }
        return false
    } catch (e) {
        console.error('Error when creating vacancy:', e.message, e.stack);
        throw new Error('Error when creating vacancy', e)
    }
}