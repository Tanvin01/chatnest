import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token" }) as any;
  try {
    const { id } = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { id: string };
    req.userId = id; next();
  } catch { res.status(401).json({ error: "Invalid token" }); }
};
export const authenticateSocket = (socket: any, next: Function) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("No token"));
  try {
    const { id } = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { id: string };
    socket.userId = id; next();
  } catch { next(new Error("Invalid token")); }
};
