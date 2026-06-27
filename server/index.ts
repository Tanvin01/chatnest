import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { createClient } from "redis";
import authRoutes from "./routes/auth";
import messageRoutes from "./routes/messages";
import channelRoutes from "./routes/channels";
import { authenticateSocket } from "./middleware/auth";
import { registerSocketHandlers } from "./socket/handlers";

const app = express();
const httpServer = http.createServer(app);

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/channels", channelRoutes);
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Socket.io
export const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] },
  pingTimeout: 60000,
});

// Redis client for pub/sub
export const redisPublisher = createClient({ url: process.env.REDIS_URL });
export const redisSubscriber = redisPublisher.duplicate();

io.use(authenticateSocket);
io.on("connection", registerSocketHandlers);

async function bootstrap() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("✅ MongoDB connected");

  await redisPublisher.connect();
  await redisSubscriber.connect();
  console.log("✅ Redis connected");

  const PORT = process.env.PORT ?? 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 ChatNest server running on port ${PORT}`);
  });
}

bootstrap().catch(console.error);
