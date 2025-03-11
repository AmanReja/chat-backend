import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const httpServer = createServer(app); // Create HTTP server for Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: ["https://chat-front-i6td.vercel.app", "http://localhost:5173"], // Adjust this for security in production
    methods: ["GET", "POST"]
  }
});

app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 3000;

import authroutes from "../src/routers/auth.router.js";
import userrouters from "../src/routers/user.router.js";
import messagerouters from "../src/routers/message.router.js";

const mongostring = process.env.DATABASE_URL;

mongoose.connect(mongostring);

const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

app.use(cors());
app.use("/api/auth", authroutes);
app.use("/api/user", userrouters);
app.use("/api/message", messagerouters);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const users = {}; // Stores active users with their socket ids

export const getReceiverSocketid = (receiverid) => {
  return users[receiverid]; // Return socket id for receiver
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  const userid = socket.handshake.query.userid;

  if (userid && !users[userid]) {
    users[userid] = socket.id;
    console.log(users);
  }

  io.emit("getonline", Object.keys(users));

  socket.on("sendMessage", (messageData) => {
    console.log("Message received:", messageData);
    const receiverSocketId = getReceiverSocketid(messageData.receiverid);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageData); // Emit message to receiver
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete users[userid]; // Remove from users list on disconnect
    io.emit("getonline", Object.keys(users));
  });
});

// Start the server
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export the io object for use elsewhere
export { io, app, Server };
