import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io'
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

connectDB()

const io = new Server(server, {
    cors: {
        origin: /localhost:\d+$/, //esto permite escuchar a cualquier puerto euq provenga de localhost
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    socket.on('message', (message) => {
        console.log('Message received:', message);
        io.emit('message', message); // Emit the message to all connected clients
    });
});

app.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'Server is running',
    });
});

app.use('/api/auth', authRoutes)

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});