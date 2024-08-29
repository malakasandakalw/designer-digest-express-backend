const db = require("../db-connector");

exports.createVacancy = async (title, description, userId, application_url) => {
    try {
        const result = await db.query("INSERT INTO vacancies(title, description, application_url, is_active, created_by) VALUES ($1, $2, $3, TRUE, $4) returning vacancies.id", [title, description, application_url, userId])
        if (result.rows.length) {
            return result.rows[0].id
        }
        return null
    } catch (e) {
        console.error('Error when creating vacancy:', e.message, e.stack);
        throw new Error('Error when creating vacancy', e)
    }
}


exports.createvacancyCategories = async (vacancyId, categories) => {
    try {
        const values = categories.map((_, index) => `($1, $${index + 2})`).join(', ');
        const result = await db.query(`INSERT INTO vacancy_categories (vacancy_id, designer_category_id) VALUES ${values}`, [vacancyId, ...categories])
        if (result) {
            return true
        }
        return false
    } catch (e) {
        console.error('Error when creating vacancy categories:', e.message, e.stack);
        throw new Error('Error when creating vacancy categories', e)
    }
}

exports.createvacancyLocations = async (vacancyId, locations) => {
    try {
        const values = locations.map((_, index) => `($1, $${index + 2})`).join(', ');
        const result = await db.query(`INSERT INTO vacancy_locations (vacancy_id, location_id) VALUES ${values}`, [vacancyId, ...locations])
        if (result) {
            return true
        }
        return false
    } catch (e) {
        console.error('Error when creating vacancy locations:', e.message, e.stack);
        throw new Error('Error when creating vacancy locations', e)
    }
}

exports.getByEmployer = async (active, userId, categories, locations, search, pageIndex, pageSize) => {
    try {
        const query = `SELECT * FROM get_vacancies_by_employer_id($1, $2, $3, $4, $5, $6, $7)`;
        const result = await db.query(query, [userId, categories, locations, active, search, pageIndex, pageSize]);

        if (result.rows.length === 0) {
            return { vacancies: [], total: 0 };
        }

        return {
            vacancies: result.rows,
            total: result.rows[0].total
        };

    } catch (e) {
        console.error('Error when getting vacancies by employer:', e.message, e.stack);
        throw new Error('Error when getting vacancies by employer', e);
    }
};

exports.getById = async (vacancyId) => {
    try {
        const result = await db.query(`SELECT * FROM get_vacancy_by_id($1)`, [vacancyId])
        if (result.rows.length) {
            return result.rows[0];
        }
    } catch (e) {
        console.error('Error when getting vacancy:', e.message, e.stack);
        throw new Error('Error when getting vacancy', e);
    }
}

exports.getFullById = async (vacancyId) => {
    try {
        const result = await db.query(`SELECT * FROM get_full_vacancy_by_id($1)`, [vacancyId])
        if (result.rows.length) {
            return result.rows[0];
        }
    } catch (e) {
        console.error('Error when getting vacancy:', e.message, e.stack);
        throw new Error('Error when getting vacancy', e);
    }
}


