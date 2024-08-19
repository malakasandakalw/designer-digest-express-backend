SELECT 
    p.id AS post_id, p.title, p.description, p.created_at, p.created_by, 
    json_agg( json_build_object( 'type', pm.type, 'media_url', pm.media_url, 'is_thumbnail', pm.is_thumbnail ) ) FILTER (WHERE pm.is_thumbnail = false) AS media, json_build_object( 'type', pt.type, 'media_url', pt.media_url ) AS thumbnail, 
    json_agg( json_build_object( 'id', c.id, 'name', c.name ) ) AS categories, 
    COUNT(DISTINCT pu.voted_by) AS upvote_count FROM posts p 
    LEFT JOIN post_media pm ON p.id = pm.post_id AND pm.is_thumbnail = false 
    LEFT JOIN post_media pt ON p.id = pt.post_id AND  pt.is_thumbnail = true 
    LEFT JOIN post_categories pc ON p.id = pc.post_id 
    LEFT JOIN categories c ON pc.category_id = c.id 
    LEFT JOIN post_upvotes pu ON p.id = pu.post_id 
    WHERE p.created_by = (SELECT id FROM designers WHERE user_id = $1) AND c.id = ANY($3::uuid[]) 
    GROUP BY p.id, p.title, p.description, p.created_at, p.created_by, pt.type, pt.media_url ORDER BY p.created_at DESC LIMIT $4 OFFSET $5

userId = '58b30fe8-efc5-4761-a646-3917a2eddba9'
categories = '6512f44e-db27-40c9-9142-7f0920308897'
orderBy = 'recent'
search = ''
pageIndex = '1'
pageSize = '2'

