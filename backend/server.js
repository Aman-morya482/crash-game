import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import { gameLoop } from './controllers/gameLoop.js';
import crashRoutes from './routes/gameRoutes.js';
import authRoutes from './routes/auth.js'
import betRoutes from './routes/betRoutes.js'
import updateAmountRoutes from './routes/amountRoute.js'

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT"],
  credentials: true
})); 
app.use(express.json());

connectDB();

app.use('/api', crashRoutes);
app.use('/api', authRoutes);
app.use('/api', betRoutes);
app.use('/api',updateAmountRoutes);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Set();
wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);
  
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

export function broadcastToClients(data) {
  const json = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  }
}

gameLoop();

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
