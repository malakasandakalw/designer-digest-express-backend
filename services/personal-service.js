const db = require("../db-connector");

createDesignerAccount = async (userId, locationId) => {
    try {
        const result = await db.query("INSERT INTO designers(user_id, location_id) VALUES ($1, $2) RETURNING id", [userId, locationId]);
        if (result.rows.length) {
            return result.rows[0].id
        }
        return null
    } catch (error) {
        console.error('Error when creating designer:', e.message, e.stack);
        throw new Error('Error when creating designer', e);
    }
}

assignCategoryForDesigner = async (categories, designerId) => {
    try {
        let assignedCategories = [];
        for (let category of categories) {
            const result = await db.query("INSERT INTO designer_assigned_categories(category_id, designer_id) VALUES ($1, $2) RETURNING category_id", [category, designerId]);
            if (result.rows.length) {
                assignedCategories.push(result.rows[0].category_id)
            }
        }
        return assignedCategories
    } catch (error) {
        console.error('Error when assign category to designer:', e.message, e.stack);
        throw new Error('Error when assign category to designer', e);
    }
}

updateUserRoleToDesigner = async (userId) => {
    try {
        const result = await db.query("UPDATE users SET user_role=(SELECT id FROM user_roles WHERE key='DESIGNER') WHERE users.id=$1", [userId])
        if (result) {
            return true
        }
        return false
    } catch (error) {
        console.error('Error when updating role to designer:', e.message, e.stack);
        throw new Error('Error when updating role to designer', e);
    }
}

exports.convertToDesigner = async (userId, locationId, categories) => {

    if (userId.toString().trim() === '' || locationId.toString().trim() === '' || !categories.length) return;

    try {
        const designerId = await createDesignerAccount(userId, locationId)
        if (designerId) {
            const assignedCategories = await assignCategoryForDesigner(categories, designerId)
            if (assignedCategories.length) {
                const updateUser = await updateUserRoleToDesigner(userId)
                return updateUser
            }
            return false
        }
        return false
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

exports.checkUserAvailable = async (id) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE id=$1 AND user_role=(SELECT id FROM user_roles WHERE key='PERSONAL')", [id])
        if (result.rows.length) return true;
        return false;
    } catch (e) {
        console.error('Error when checking personal aacounts:', e.message, e.stack);
        throw new Error('Error when checking personal aacounts', e);
    }
}