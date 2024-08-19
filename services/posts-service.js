const db = require("../db-connector");

exports.getByDesigner = async (userId, categories, orderBy, search, pageIndex, pageSize) => {
    try {
        const query = `SELECT * FROM get_posts_by_designer($1, $2, $3, $4, $5, $6)`;
        const result = await db.query(query, [userId, categories, orderBy, search, pageIndex, pageSize]);

        if (result.rows.length === 0) {
            return { posts: [], total: 0 };
        }

        return {
            posts: result.rows,
            total: result.rows[0].total
        };

    } catch (e) {
        console.error('Error when getting posts by designer:', e.message, e.stack);
        throw new Error('Error when getting posts by designer', e);
    }
};

async function removeDuplicates(posts) {
    return posts.map(post => {
        const uniqueMedia = post.media.reduce((acc, current) => {
            const x = acc.find(item => item.media_url === current.media_url);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);

        const uniqueCategories = post.categories.reduce((acc, current) => {
            const x = acc.find(item => item.id === current.id);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);

        return {
            ...post,
            media: uniqueMedia,
            categories: uniqueCategories,
        };
    });
}



exports.getById = async (postId) => {
    try {
        const result = await db.query(`SELECT * FROM get_post_by_id($1)`, [postId])
        if (result.rows.length) {
            return result.rows;
        }
    } catch (e) {
        console.error('Error when getting post:', e.message, e.stack);
        throw new Error('Error when getting post', e);
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