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

exports.getAllDesigners = async () => {
    try {
        const result = await db.query("SELECT id, first_name, last_name, email, (SELECT value FROM user_roles WHERE id=users.user_role) as role, profile_picture FROM users WHERE user_role=(SELECT id FROM user_roles WHERE key='DESIGNER') ORDER BY first_name")
        if (result.rows) {
            return result.rows;
        }
        return []
    } catch (e) {
        console.error('Error when getting users:', e.message, e.stack);
        throw new Error('Error when getting users', e);
    }
}

exports.updateUserData = async (user_id, first_name, last_name, location, profile_picture, phone) => {
    try {
        const result = await db.query("UPDATE users SET first_name=$2, last_name=$3, profile_picture=$4, phone=$5 WHERE users.id=$1", [user_id, first_name, last_name, profile_picture, phone])
        if (result) {
            const result_ = await db.query("UPDATE designers SET location_id=$2 WHERE user_id=$1", [user_id, location])
            if (result_) {
                return true
            }
        }
        return false
    } catch (e) {
        console.error('Error when profile:', e.message, e.stack);
        throw new Error('Error when profile', e);
    }
}

exports.deleteDesignerCategories = async (designer_id) => {
    try {
        const result = await db.query(`DELETE FROM designer_assigned_categories WHERE designer_id=$1`, [designer_id])
        if (result) {
            return true
        }
        return false
    } catch (e) {
        console.error('Error when deleting designer categories:', e.message, e.stack);
        throw new Error('Error when deleting designer categories', e)
    }
}

exports.createDesignerCategories = async (designer_id, categories) => {
    try {
        const values = categories.map((_, index) => `($1, $${index + 2})`).join(', ');
        const result = await db.query(`INSERT INTO designer_assigned_categories (designer_id, category_id) VALUES ${values}`, [designer_id, ...categories])
        if (result) {
            return true
        }
        return false
    } catch (e) {
        console.error('Error when creating designer categories:', e.message, e.stack);
        throw new Error('Error when creating designer categories', e)
    }
}

exports.getFilteredDesigners = async (userId, followed_only, categories, orderBy, locations, search, pageIndex, pageSize) => {
    try {
        const result = await db.query("SELECT * FROM get_filtered_designers($1,$2,$3,$4,$5,$6,$7,$8)", [userId, followed_only, locations, categories, orderBy, search, pageIndex, pageSize])
        if (result.rows) {

            if (result.rows.length === 0) {
                return { designers: [], total: 0 };
            }

            return {
                designers: result.rows,
                total: result.rows[0].total
            };
        }
    } catch (e) {
        console.error('Error when getting users:', e.message, e.stack);
        throw new Error('Error when getting users', e);
    }
}

exports.getDataByDesigner = async (designer_id, user_id) => {
    try {
        const result = await db.query(`SELECT * FROM get_designer_data($1, $2)`, [designer_id, user_id])
        if (result.rows) {
            return result.rows[0]
        }
        return null
    } catch (e) {
        console.error('Error when getting users:', e.message, e.stack);
        throw new Error('Error when getting users', e);
    }
}

exports.getDashboardStats = async (user_id) => {
    try {
        const result = await db.query(`
        SELECT 
            d.user_id, 
            u.first_name, 
            u.last_name,
            COUNT(DISTINCT p.id) AS post_count,
            COUNT(DISTINCT f.user_id) AS followers_count,
            COUNT(DISTINCT pu.voted_by) AS upvotes_count
        FROM 
            designers d
        LEFT JOIN 
            users u ON d.user_id = u.id
        LEFT JOIN 
            posts p ON d.id = p.created_by
        LEFT JOIN 
            followings f ON d.id = f.designer_id
        LEFT JOIN 
            post_upvotes pu ON p.id = pu.post_id
        WHERE 
            d.user_id = $1
        GROUP BY 
            d.user_id, u.first_name, u.last_name;
        `, [user_id])
        if (result.rows) {
            return result.rows[0]
        }
        return null
    } catch (e) {
        console.error('Error when getting dashboard stats', e.message, e.stack)
        throw new Error('Error when getting stats', e)
    }
}

exports.getDashboardFollowingCount = async (user_id, start_date, end_date) => {
    try {
        const result = await db.query(`SELECT DATE(created_at) AS day, COUNT(*) AS follow_count FROM  followings WHERE designer_id = (SELECT id FROM designers WHERE user_id = $1) AND created_at BETWEEN $2 AND $3 GROUP BY day ORDER BY day;`, [user_id, start_date, end_date])
        if (result) return result.rows
        return []
    } catch (e) {
        console.error('Error when getting follwing count:', e.message, e.stack);
        throw new Error('Error when getting follwing count', e);
    }
}

exports.getDashboardVotesCount = async (user_id, start_date, end_date) => {
    try {
        const result = await db.query(`SELECT  p.title AS post_title, COUNT(*) AS vote_count FROM post_upvotes pu JOIN posts p ON pu.post_id = p.id WHERE p.created_by = (SELECT id FROM designers WHERE user_id = $1) AND pu.created_at BETWEEN $2 AND $3 GROUP BY p.title ORDER BY p.title`, [user_id, start_date, end_date])
        if (result) return result.rows
        return []
    } catch (e) {
        console.error('Error when getting votes count:', e.message, e.stack);
        throw new Error('Error when getting votes count', e);
    }
}

exports.getDashboardPostsCount = async (user_id, start_date, end_date) => {
    try {
        const result = await db.query(`SELECT DATE(created_at) AS day, COUNT(*) AS post_count FROM posts WHERE created_by = (SELECT id FROM designers WHERE user_id = $1) AND created_at BETWEEN $2 AND $3 GROUP BY day ORDER BY day`, [user_id, start_date, end_date])
        if (result) return result.rows
        return []
    } catch (e) {
        console.error('Error when getting posts count:', e.message, e.stack);
        throw new Error('Error when getting posts count', e);
    }
}

exports.getDesignerDataByUserId = async (user_id) => {
    try {
        const result = await db.query(`SELECT * FROM get_designer_data_by_user_id($1)`, [user_id])
        if (result.rows) {
            const dataRow = result.rows[0]
            let designer = {
                user_id: dataRow.u_user_id,
                first_name: dataRow.first_name,
                last_name: dataRow.last_name,
                email: dataRow.email,
                phone: dataRow.phone,
                profile_picture: dataRow.profile_picture,
                locations: dataRow.locations,
                categories: dataRow.categories,
                designer_id: dataRow.vd_designer_id
            }
            return designer
        }
    } catch (e) {
        console.error('Error when getting users:', e.message, e.stack);
        throw new Error('Error when getting users', e);
    }
}


exports.getPublicFilteredDesigners = async (categories, orderBy, locations, search, pageIndex, pageSize) => {
    try {
        const result = await db.query("SELECT * FROM get_public_designers($1,$2,$3,$4,$5,$6)", [locations, categories, orderBy, search, pageIndex, pageSize])
        if (result.rows) {

            if (result.rows.length === 0) {
                return { designers: [], total: 0 };
            }

            return {
                designers: result.rows,
                total: result.rows[0].total
            };

        }
    } catch (e) {
        console.error('Error when getting users:', e.message, e.stack);
        throw new Error('Error when getting users', e);
    }
}

exports.follow = async (designer_id, userId) => {
    try {

        const isRecordAvailable = await db.query("SELECT * FROM followings WHERE user_id=$1 AND designer_id=$2", [userId, designer_id])

        if (isRecordAvailable.rows.length) {
            const result = await db.query("DELETE FROM followings WHERE user_id=$1 AND designer_id=$2", [userId, designer_id])
            if (result) {
                return { followed: false, user_id: userId, designer_id: designer_id }
            }
            return null
        } else {

            const result = await db.query("INSERT INTO followings(user_id, designer_id) VALUES ($1, $2)", [userId, designer_id])
            if (result.rows) {
                return { followed: true, user_id: userId, designer_id: designer_id }
            }
            return null

        }
    } catch (e) {
        console.error('Error when upvoting:', e.message, e.stack);
        throw new Error('Error when upvoting', e)
    }
}
