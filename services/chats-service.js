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
        const from_socket = await db.query("SELECT socket_id FROM users_sockets WHERE user_id=$1",[fromId])
        if (from_socket.rows) {
            const to_socket = await db.query("SELECT socket_id FROM users_sockets WHERE user_id=$1",[toId])
            if(to_socket.rows) {
                return {from_socket: from_socket.rows[0].socket_id, to_socket: to_socket.rows[0].socket_id}
            }
            return {from_socket: from_socket.rows[0].socket_id, to_socket: null}
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
        const result = await db.query("SELECT * FROM messages")
        if (result.rows.length) {
            return result.rows;
        }
    } catch (e) {
        console.error('Error when getting chats:', e.message, e.stack);
        throw new Error('Error when getting chats', e);
    }
}

exports.createMessage = async (data) => {
    try {
        const { from_user, to_user, message, type, file_url } = data
        const result = await db.query("INSERT INTO messages(type, message, file_url, from_user, to_user) VALUES ($1, $2, $3, $4, $5)", [type, message, file_url, from_user, to_user])
        if (result) {
            return true
        }
        return false
    } catch (e) {
        console.error('Error when creating message:', e.message, e.stack);
        throw new Error('Error when creating message', e);
    }
}