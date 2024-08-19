const app = require("./app");

const dotenv = require("dotenv");
dotenv.config()

const port = process.env.PORT || 3000;

const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});

const chatsService = require("./services/chats-service")
const jwt = require('jsonwebtoken');
const secretKey = 'backend_secret_key';

io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on('authenticate', async (token) => {
        const userId = decodeToken(token);
        if (userId) {
            console.log(`Authenticated user ID ${userId} with socket ID ${socket.id}`);
            const result = await chatsService.setSocketId(userId, socket.id)
            if(result) {
                console.log('connected')
            }
        }
    });

    socket.on('sendMessage', async (data) => {
        const result = await chatsService.createMessage(data)
        if(result) {
            const {from_socket, to_socket} = await chatsService.getSocketIds(data.from_user, data.to_user)
            io.to(from_socket).emit('receiveMessage', data)
            io.to(to_socket).emit('receiveMessage', data)
        }
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

function decodeToken(token) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded.id;
    } catch (err) {
        return null;
    }
}

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})