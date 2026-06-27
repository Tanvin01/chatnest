import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { Channel } from "../models/Channel";
import { Message } from "../models/Message";
const router = Router();
router.use(authMiddleware);
router.get("/", async (req: any, res) => {
  const channels = await Channel.find({ members: req.userId }).populate("lastMessage").sort({ lastActivityAt: -1 });
  res.json(channels);
});
router.post("/", async (req: any, res) => {
  const { name, description, type } = req.body;
  const channel = await Channel.create({ name, description, type, members: [req.userId], createdBy: req.userId });
  res.status(201).json(channel);
});
router.post("/:id/join", async (req: any, res) => {
  await Channel.findByIdAndUpdate(req.params.id, { $addToSet: { members: req.userId } });
  res.json({ message: "Joined" });
});
router.get("/:id/messages", async (req: any, res) => {
  const { before, limit = 50 } = req.query;
  const query: any = { channelId: req.params.id };
  if (before) query._id = { $lt: before };
  const messages = await Message.find(query).sort({ _id: -1 }).limit(+limit).populate("author", "name avatar");
  res.json(messages.reverse());
});
export default router;
