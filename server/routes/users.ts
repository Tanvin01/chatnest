import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { User } from "../models/User";
const router = Router();
router.use(authMiddleware);
router.get("/", async (req: any, res) => {
  const users = await User.find({ _id: { $ne: req.userId } }).select("name avatar status lastSeen").limit(50);
  res.json(users);
});
router.get("/me", async (req: any, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});
router.patch("/me", async (req: any, res) => {
  const { name, avatar } = req.body;
  const user = await User.findByIdAndUpdate(req.userId, { name, avatar }, { new: true }).select("-password");
  res.json(user);
});
export default router;
