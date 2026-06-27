import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
const router = Router();
const sign = (id: string) => jwt.sign({ id }, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" });
const signRefresh = (id: string) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email taken" }) as any;
    const user = await User.create({ name, email, password });
    res.status(201).json({ accessToken: sign(user.id), refreshToken: signRefresh(user.id), user: { id: user.id, name: user.name, email: user.email } });
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ error: "Invalid credentials" }) as any;
    res.json({ accessToken: sign(user.id), refreshToken: signRefresh(user.id), user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});
export default router;
