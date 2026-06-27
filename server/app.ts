import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import channelRoutes from "./routes/channels";
import userRoutes from "./routes/users";
require("dotenv").config();
const app = express();
app.use(helmet()); app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); app.use(express.json({ limit:"10mb" }));
app.use("/api/auth", authRoutes); app.use("/api/channels", channelRoutes); app.use("/api/users", userRoutes);
app.get("/health", (_, res) => res.json({ status:"ok", uptime: process.uptime() }));
mongoose.connect(process.env.MONGODB_URI!).then(() => {
  app.listen(process.env.PORT || 4000, () => console.log("Server running"));
});
