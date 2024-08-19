const db = require("../db-connector");

// exports.getByDesigner = async (userId, categories, orderBy, search, pageIndex, pageSize) => {
//     try {
//         let countQuery = `
//             SELECT COUNT(DISTINCT p.id) AS total
//             FROM posts p
//             LEFT JOIN post_categories pc ON p.id = pc.post_id
//             LEFT JOIN categories c ON pc.category_id = c.id
//             WHERE p.created_by = (
//                 SELECT id FROM designers WHERE user_id = $1
//             )
//         `;

//         const params = [userId];
//         let paramIndex = 2;

//         if (categories && categories.trim() !== '') {
//             const categoryList = categories.split(',').map(cat => cat.trim());
//             countQuery += ` AND c.id = ANY($${paramIndex}::uuid[])`;
//             params.push(categoryList);
//             paramIndex++;
//         }

//         if (search && search.trim() !== '') {
//             countQuery += ` AND (p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
//             params.push(`%${search}%`);
//             paramIndex++;
//         }

//         const totalResult = await db.query(countQuery, params);
//         const total = totalResult.rows[0].total;

//         paramIndex = 2;
//         const mainParams = [userId];

//         let query = `
//             SELECT
//                 p.id AS post_id,
//                 p.title,
//                 p.description,
//                 p.created_at,
//                 p.created_by,
//                 json_agg(
//                     json_build_object(
//                         'type', pm.type,
//                         'media_url', pm.media_url,
//                         'is_thumbnail', pm.is_thumbnail
//                     )
//                 ) AS media,
//                 json_build_object(
//                     'type', pt.type,
//                     'media_url', pt.media_url
//                 ) AS thumbnail,
//                 json_agg(
//                     json_build_object(
//                         'id', c.id,
//                         'name', c.name
//                     )
//                 ) AS categories,
//                 COUNT(DISTINCT pu.voted_by) AS upvote_count
//             FROM
//                 posts p
//             LEFT JOIN
//                 post_media pm ON p.id = pm.post_id
//             LEFT JOIN
//                 post_media pt ON p.id = pt.post_id AND pt.is_thumbnail = true
//             LEFT JOIN
//                 post_categories pc ON p.id = pc.post_id
//             LEFT JOIN
//                 categories c ON pc.category_id = c.id
//             LEFT JOIN
//                 post_upvotes pu ON p.id = pu.post_id
//             WHERE
//                 p.created_by = (
//                     SELECT id FROM designers WHERE user_id = $1
//                 )
//         `;

//         if (categories && categories.trim() !== '') {
//             query += ` AND c.id = ANY($${paramIndex}::uuid[])`;
//             mainParams.push(categories.split(',').map(cat => cat.trim()));
//             paramIndex++;
//         }

//         if (search && search.trim() !== '') {
//             query += ` AND (p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
//             mainParams.push(`%${search}%`);
//             paramIndex++;
//         }

//         query += `
//             GROUP BY
//                 p.id, p.title, p.description, p.created_at, p.created_by, pt.type, pt.media_url
//         `;

//         if (orderBy === 'most_voted') {
//             query += ` ORDER BY upvote_count DESC`;
//         } else if (orderBy === 'oldest') {
//             query += ` ORDER BY p.created_at ASC`;
//         } else {
//             query += ` ORDER BY p.created_at DESC`;
//         }

//         const offset = (pageIndex - 1) * parseInt(pageSize, 10);
//         query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
//         mainParams.push(parseInt(pageSize, 10), offset);

//         const result = await db.query(query, mainParams);
//         const data = await removeDuplicates(result.rows)
//         return {
//             posts: data,
//             total
//         };
//     } catch (e) {
//         console.error('Error when getting posts:', e.message, e.stack);
//         throw new Error('Error when getting posts', e);
//     }
// };

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