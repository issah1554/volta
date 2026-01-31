// server.js
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3001;
const HOST = "127.0.0.1";

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// userId -> latest location object
const locations = new Map();
// socket.id -> userId (for cleanup on disconnect)
const socketToUser = new Map();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Send current locations to new client
  socket.emit("locationUpdate", Array.from(locations.values()));

  socket.on("sendLocation", (data) => {
    const { userId } = data || {};
    if (!userId) return;

    locations.set(userId, data);
    socketToUser.set(socket.id, userId);

    io.emit("locationUpdate", Array.from(locations.values()));
  });

  socket.on("stopSharing", ({ userId } = {}) => {
    if (!userId) return;

    locations.delete(userId);
    if (socketToUser.get(socket.id) === userId) socketToUser.delete(socket.id);

    io.emit("locationUpdate", Array.from(locations.values()));
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    const userId = socketToUser.get(socket.id);
    if (userId) {
      locations.delete(userId);
      socketToUser.delete(socket.id);
      io.emit("locationUpdate", Array.from(locations.values()));
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Socket.IO server running on http://${HOST}:${PORT}`);
});
