CREATE OR REPLACE FUNCTION get_user_chats(from_user_id UUID)
RETURNS TABLE(
    user_id UUID,
    user_name VARCHAR,
    user_avatar TEXT,
    latest_message TEXT,
    unread_messages_count INT
) AS $$
BEGIN
    RETURN QUERY
    WITH LastMessages AS (
        SELECT
            m.from_user,
            m.to_user,
            m.message AS latest_message,
            m.created_at,
            ROW_NUMBER() OVER (PARTITION BY LEAST(m.from_user, m.to_user), GREATEST(m.from_user, m.to_user) ORDER BY m.created_at DESC) AS rn
        FROM
            messages m
        WHERE
            m.to_user = from_user_id OR m.from_user = from_user_id
    ),
    UnreadCounts AS (
        SELECT
            CASE
                WHEN from_user = from_user_id THEN to_user
                ELSE from_user
            END AS other_user,
            COUNT(*) AS unread_count
        FROM
            messages
        WHERE
            is_read = FALSE
            AND (to_user = from_user_id OR from_user = from_user_id)
        GROUP BY
            other_user
    )
    SELECT
        u.id AS user_id,
        u.username AS user_name,
        u.avatar AS user_avatar,
        lm.latest_message,
        COALESCE(uc.unread_count, 0) AS unread_messages_count
    FROM
        users u
    JOIN
        LastMessages lm ON u.id = CASE WHEN lm.from_user = from_user_id THEN lm.to_user ELSE lm.from_user END
    LEFT JOIN
        UnreadCounts uc ON uc.other_user = u.id
    WHERE
        lm.rn = 1;
END; $$
LANGUAGE plpgsql;
