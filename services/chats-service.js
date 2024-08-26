const db = require("../db-connector");

exports.setSocketId = async (userId, socketId) => {
    const query = `
        INSERT INTO users_sockets (user_id, socket_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id) 
        DO UPDATE SET socket_id = EXCLUDED.socket_id;
    `;
    try {
        await db.query(query, [userId, socketId]);
    } catch (err) {
        console.error('Database error:', err);
    }
}

exports.getSocketIds = async (fromId, toId) => {
    try {

        if(!fromId) {
            const to_socket = await db.query("SELECT socket_id FROM users_sockets WHERE user_id=$1",[toId])
            if(to_socket.rows) {
                return {from_socket: null, to_socket: to_socket.rows[0].socket_id}
            }
        } else {
            const from_socket = await db.query("SELECT socket_id FROM users_sockets WHERE user_id=$1",[fromId])
            if (from_socket.rows) {
                const to_socket = await db.query("SELECT socket_id FROM users_sockets WHERE user_id=$1",[toId])
                if(to_socket.rows) {
                    return {from_socket: from_socket.rows[0].socket_id, to_socket: to_socket.rows[0].socket_id}
                }
                return {from_socket: from_socket.rows[0].socket_id, to_socket: null}
            }
        }

    } catch (e) {
        console.error('Error when getting chats:', e.message, e.stack);
        throw new Error('Error when getting chats', e);
    }
}

exports.getAllByDesigner = async (userId) => {
    try {
        const result = await db.query("SELECT * FROM categories")
        if (result.rows.length) {
            return result.rows;
        }
    } catch (e) {
        console.error('Error when getting chats:', e.message, e.stack);
        throw new Error('Error when getting chats', e);
    }
}

exports.getSingleChat = async (senderId, receiverId) => {
    try {
        const result = await db.query("SELECT * FROM messages WHERE from_user IN ($1::UUID,$2::UUID) AND to_user IN ($1::UUID,$2::UUID) ORDER BY created_at ASC",[senderId, receiverId])
        if (result.rows.length) {
            return result.rows;
        }
    } catch (e) {
        console.error('Error when getting chats:', e.message, e.stack);
        throw new Error('Error when getting chats', e);
    }
}

exports.getUnreadMessagesCount = async (to_user) => {
    try {
        const result = await db.query("SELECT COUNT(id) FROM messages WHERE to_user=$1 AND is_read=FALSE",[to_user])
        if (result.rows) {
            return result.rows[0].count;
        }
    } catch (e) {
        console.error('Error when getting unread count:', e.message, e.stack);
        throw new Error('Error when getting unread count', e);
    }
}

exports.readAllByChat  = async (toId, fromId) => {
    try {
        const result = await db.query("UPDATE messages SET is_read=TRUE WHERE from_user=$1 AND to_user=$2", [fromId, toId])
        if (result) {
            return result.rows
        }
        return null
    } catch (e) {
        console.error('Error when creating message:', e.message, e.stack);
        throw new Error('Error when creating message', e);
    }
}

exports.createMessage = async (data) => {
    try {
        const { from_user, to_user, message, type, file_url } = data
        const result = await db.query("INSERT INTO messages(type, message, file_url, from_user, to_user) VALUES ($1, $2, $3, $4, $5) RETURNING id", [type, message, file_url, from_user, to_user])
        if (result) {
            return result.rows
        }
        return null
    } catch (e) {
        console.error('Error when creating message:', e.message, e.stack);
        throw new Error('Error when creating message', e);
    }
}

exports.readMessage = async(id, to_user) => {
    try {
        const result = await db.query("UPDATE messages SET is_read=TRUE WHERE id=$1 AND to_user=$2",[id, to_user])
        if (result) {
            return true
        }
        return false
    } catch (e) {
        console.error('Error when creating message:', e.message, e.stack);
        throw new Error('Error when creating message', e);
    }
}