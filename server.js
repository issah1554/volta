// server.js
const { Server } = require("socket.io");
const http = require("http");

const PORT = 3001;

// Store locations in memory
let locations = [];

// Create HTTP server (needed for Socket.IO)
const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: "*", // allow all origins (for dev)
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Send existing locations to new client
    socket.emit("locationUpdate", locations);

    // Receive location from clients
    socket.on("sendLocation", (data) => {
        // Update the location for this user
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
