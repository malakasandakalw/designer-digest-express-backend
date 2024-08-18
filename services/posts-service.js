const db = require("../db-connector");

exports.getByDesigner = async (userId) => {
    try {
        const result = await db.query(`
        SELECT
                p.id AS post_id,
                p.title,
                p.description,
                p.created_at,
                p.created_by,
                json_agg(
                    json_build_object(
                        'type', pm.type,
                        'media_url', pm.media_url,
                        'is_thumbnail', pm.is_thumbnail
                    )
                ) FILTER (WHERE pm.is_thumbnail = false) AS media,
                json_build_object(
                    'type', pt.type,
                    'media_url', pt.media_url
                ) AS thumbnail,
                json_agg(
                    json_build_object(
                        'id', c.id,
                        'name', c.name
                    )
                ) AS categories,
                COUNT(DISTINCT pu.voted_by) AS upvote_count
            FROM
                posts p
            LEFT JOIN
                post_media pm ON p.id = pm.post_id AND pm.is_thumbnail = false
            LEFT JOIN
                post_media pt ON p.id = pt.post_id AND pt.is_thumbnail = true
            LEFT JOIN
                post_categories pc ON p.id = pc.post_id
            LEFT JOIN
                categories c ON pc.category_id = c.id
            LEFT JOIN
                post_upvotes pu ON p.id = pu.post_id
            WHERE
                p.created_by = (
                    SELECT id FROM designers WHERE user_id = $1
                )
            GROUP BY
                p.id, p.title, p.description, p.created_at, p.created_by, pt.type, pt.media_url
            ORDER BY
                p.created_at DESC;
        `, [userId])
        if (result.rows.length) {
            return result.rows;
        }
    } catch (e) {
        console.error('Error when getting posts:', e.message, e.stack);
        throw new Error('Error when getting posts', e);
    }
}

exports.createPost = async (title, description, userId) => {
    try {
        const result = await db.query("INSERT INTO posts(title, description, created_by) VALUES ($1, $2, (SELECT id FROM designers WHERE user_id=$3)) returning posts.id", [title, description, userId])
        if (result.rows.length) {
            return result.rows[0].id
        }
        return null
    } catch (e) {
        console.error('Error when creating post:', e.message, e.stack);
        throw new Error('Error when creating post', e)
    }
}

exports.createPostCategories = async (postId, categories) => {
    try {
        const values = categories.map((_, index) => `($1, $${index + 2})`).join(', ');
        const result = await db.query(`INSERT INTO post_categories (post_id, category_id) VALUES ${values}`, [postId, ...categories])
        if (result) {
            return true
        }
        return false
    } catch (e) {
        console.error('Error when creating post categories:', e.message, e.stack);
        throw new Error('Error when creating post categories', e)
    }
}

exports.createPostFiles = async (postId, files, thumbnail) => {
    try {

        const dataRow = await setFileRow(files, thumbnail)

        if (!dataRow.length) return false

        const types = dataRow.map(row => row.type);
        const mediaUrls = dataRow.map(row => row.media_url);
        const isThumbnails = dataRow.map(row => row.is_thumbnail);

        const query = `
            INSERT INTO post_media (post_id, type, media_url, is_thumbnail)
            SELECT $1, UNNEST($2::text[]), UNNEST($3::text[]), UNNEST($4::boolean[])
        `;

        const params = [postId, types, mediaUrls, isThumbnails];

        const result = await db.query(query, params)

        if (result) {
            return true
        }

        return false

    } catch (e) {
        console.error('Error when creating post categories:', e.message, e.stack);
        throw new Error('Error when creating post categories', e)
    }
}

async function setFileRow(files, thumbnail) {
    let dataRow = []

    files.forEach(file => {
        const obj = {
            type: file.type,
            media_url: file.url,
            is_thumbnail: file.url === thumbnail ? true : false
        }
        dataRow.push(obj)
    })

    return dataRow
}