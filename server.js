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

// Store latest location for each user
let locations = [];

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Send current locations to new client
  socket.emit("locationUpdate", locations);

  // Receive location updates from clients
  socket.on("sendLocation", (data) => {
    const idx = locations.findIndex((l) => l.userId === data.userId);
    if (idx >= 0) locations[idx] = data;
    else locations.push(data);

    // Broadcast updated locations to all clients
    io.emit("locationUpdate", locations);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
