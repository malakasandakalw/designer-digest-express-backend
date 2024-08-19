CREATE OR REPLACE FUNCTION get_post_by_id(p_id UUID)
RETURNS TABLE (
    post_id UUID,
    title TEXT,
    description TEXT,
    created_at TIMESTAMPTZ,
    created_by UUID,
    media JSONB,
    thumbnail JSONB,
    categories JSONB,
    upvote_count INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id AS post_id,
        p.title,
        p.description,
        p.created_at,
        p.created_by,
        COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
            'type', pm.type,
            'media_url', pm.media_url,
            'is_thumbnail', pm.is_thumbnail
        )) FILTER (WHERE pm.media_url IS NOT NULL), '[]'::jsonb) AS media,
        jsonb_build_object(
            'type', pt.type,
            'media_url', pt.media_url
        ) AS thumbnail,
        COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
            'id', c.id,
            'name', c.name
        )) FILTER (WHERE c.id IS NOT NULL), '[]'::jsonb) AS categories,
        COUNT(DISTINCT pu.voted_by)::int AS upvote_count
    FROM
        posts p
    LEFT JOIN
        post_media pm ON p.id = pm.post_id
    LEFT JOIN
        post_media pt ON p.id = pt.post_id AND pt.is_thumbnail = true
    LEFT JOIN
        post_categories pc ON p.id = pc.post_id
    LEFT JOIN
        categories c ON pc.category_id = c.id
    LEFT JOIN
        post_upvotes pu ON p.id = pu.post_id
    WHERE
        p.id = p_id
    GROUP BY
        p.id, pt.type, pt.media_url;
END;
$$ LANGUAGE plpgsql;








CREATE OR REPLACE FUNCTION get_posts_by_designer(
    p_user_id UUID,
    p_categories TEXT DEFAULT NULL,
    p_order_by TEXT DEFAULT 'recent',
    p_search TEXT DEFAULT NULL,
    p_page_index INT DEFAULT 1,
    p_page_size INT DEFAULT 10
)
RETURNS TABLE (
    post_id UUID,
    title TEXT,
    description TEXT,
    created_at TIMESTAMPTZ,
    created_by UUID,
    media JSONB,
    thumbnail JSONB,
    categories JSONB,
    upvote_count INT,
    total INT
) AS $$
DECLARE
    v_designer_id UUID;
    v_category_ids UUID[];
    v_offset INT;
BEGIN
    -- Find designer ID based on the provided user ID
    SELECT id INTO v_designer_id FROM designers WHERE user_id = p_user_id;
    IF v_designer_id IS NULL THEN
        RAISE EXCEPTION 'Designer not found for the given user ID';
    END IF;

    -- Convert the category list to an array of UUIDs if provided
    IF p_categories IS NOT NULL AND p_categories <> '' THEN
        v_category_ids := string_to_array(p_categories, ',')::uuid[];
    ELSE
        v_category_ids := NULL; -- NULL if no categories are provided
    END IF;

    -- Calculate the offset for pagination
    v_offset := (p_page_index - 1) * p_page_size;

    -- Perform the query to get the posts by designer
    RETURN QUERY
    WITH total_count AS (
        SELECT COUNT(DISTINCT p.id) AS total
        FROM posts p
        LEFT JOIN post_categories pc ON p.id = pc.post_id
        LEFT JOIN categories c ON pc.category_id = c.id
        WHERE p.created_by = v_designer_id
        AND (v_category_ids IS NULL OR c.id = ANY(v_category_ids))
        AND (p_search IS NULL OR p_search = '' OR (p.title ILIKE '%' || p_search || '%' OR p.description ILIKE '%' || p_search || '%'))
    )
    SELECT
        p.id AS post_id,
        p.title,
        p.description,
        p.created_at,
        p.created_by,
        COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
            'type', pm.type,
            'media_url', pm.media_url,
            'is_thumbnail', pm.is_thumbnail
        )) FILTER (WHERE pm.media_url IS NOT NULL), '[]'::jsonb) AS media,
        COALESCE(
            (SELECT jsonb_build_object(
                'type', pt.type,
                'media_url', pt.media_url
            ) FROM post_media pt WHERE pt.post_id = p.id AND pt.is_thumbnail = true),
            '{}'::jsonb
        ) AS thumbnail,
        COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
            'id', c.id,
            'name', c.name
        )) FILTER (WHERE c.id IS NOT NULL), '[]'::jsonb) AS categories,
        COUNT(DISTINCT pu.voted_by)::int AS upvote_count,  -- Casting bigint to integer
        tc.total::int AS total  -- Casting bigint to integer
    FROM
        posts p
    LEFT JOIN
        post_media pm ON p.id = pm.post_id
    LEFT JOIN
        post_categories pc ON p.id = pc.post_id
    LEFT JOIN
        categories c ON pc.category_id = c.id
    LEFT JOIN
        post_upvotes pu ON p.id = pu.post_id
    CROSS JOIN
        total_count tc -- Join to include the total count in the results
    WHERE
        p.created_by = v_designer_id
        AND (v_category_ids IS NULL OR c.id = ANY(v_category_ids))
        AND (p_search IS NULL OR p_search = '' OR (p.title ILIKE '%' || p_search || '%' OR p.description ILIKE '%' || p_search || '%'))
    GROUP BY
        p.id, tc.total
    ORDER BY
        CASE
            WHEN p_order_by = 'most_voted' THEN COUNT(DISTINCT pu.voted_by)
            ELSE NULL
        END DESC,
        CASE
            WHEN p_order_by = 'oldest' THEN p.created_at
            ELSE p.created_at
        END ASC
    LIMIT p_page_size OFFSET v_offset;
END;
$$ LANGUAGE plpgsql;