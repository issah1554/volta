// server.js
const { Server } = require("socket.io");
const http = require("http");

const PORT = 3001;
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
  socket.emit(
    "locationUpdate",
    Array.from(locations.values())
  );

  // Receive location updates from clients
  socket.on("sendLocation", (data) => {
    const { userId } = data;

    locations.set(userId, data);
    socketToUser.set(socket.id, userId);

    // Broadcast updated locations to all clients
    io.emit("locationUpdate", Array.from(locations.values()));
  });

  // Client explicitly stops sharing
  socket.on("stopSharing", ({ userId }) => {
    locations.delete(userId);
    // Optionally clear mapping if this socket was that user
    if (socketToUser.get(socket.id) === userId) {
      socketToUser.delete(socket.id);
    }

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

server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
