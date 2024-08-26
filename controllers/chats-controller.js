const chatsService = require("../services/chats-service")

exports.getAllByDesigner = async (req, res) => {
    try {
        const userId = req.user.id
        const result = await chatsService.getAllByDesigner(userId);
        res.status(200).json({ message: 'Getting all chats success', body: result, done: true, status: 'success' });
    } catch (e) {
        console.error('error in gettin chats function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error' });
    }
}

exports.getSingleChat = async (req, res) => {
    try {
        const {senderId, receiverId} = req.query

        if(!senderId || !receiverId) return res.status(200).json({ message: 'Invalid data', e, status: 'error' });

        const result = await chatsService.getSingleChat(senderId, receiverId);
        res.status(200).json({ message: 'Getting chat success', body: result, done: true, status: 'success' });
    } catch (e) {
        console.error('error in gettin chats function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error' });
    }
}

exports.getUnreadMessagesCount = async (req, res) => {
    try {
        const id = req.user.id
        if(!id) return res.status(200).json({ message: 'Invalid data', e, status: 'error' });

        const result = await chatsService.getUnreadMessagesCount(id);
        res.status(200).json({ message: 'Getting unread count success', body: result, done: true, status: 'success' });
    } catch (e) {
        console.error('error in gettin unread count function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error' });
    }
}

exports.readAllByChat = async (req, res) => {
    try {
        const {toId, fromId} = req.body

        if(!toId || !fromId) return res.status(200).json({ message: 'Invalid data', e, status: 'error' });

        const result = await chatsService.readAllByChat(toId, fromId);
        if(result) return res.status(200).json({ message: 'Reading chat success', body: result, done: true, status: 'success' });
        return res.status(200).json({ message: 'Reading chat failed', body: null, done: true, status: 'error' });
    } catch (e) {
        console.error('error in gettin chats function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error' });
    }
}