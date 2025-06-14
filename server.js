// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Autoriser CORS pour tous les clients (pratique pour dev / test)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Gestion des connexions Socket.io
io.on('connection', (socket) => {
  console.log(`Client connecté : ${socket.id}`);

  socket.on('join', (room) => {
    socket.join(room);
    console.log(`${socket.id} a rejoint la salle ${room}`);

    // Prévenir les autres utilisateurs de la salle
    socket.to(room).emit('user-joined');
  });

  socket.on('signal', ({ room, data }) => {
    // Transmettre les signaux WebRTC aux autres membres de la salle
    socket.to(room).emit('signal', { data });
  });

  socket.on('disconnect', () => {
    console.log(`Client déconnecté : ${socket.id}`);
  });
});

// Démarrer le serveur sur le port (Render attribue souvent le PORT via variable d'env)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
