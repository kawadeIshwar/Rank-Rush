
import express from "express";
import { User } from "./models/User.js";
import { Claim } from "./models/Claim.js";

export const router = express.Router();

// Helper: build leaderboard with rank numbers
async function buildLeaderboard() {
  const users = await User.find().sort({ totalPoints: -1, createdAt: 1 }).lean();
  let lastPoints = null, rank = 0, seen = 0;
  const withRanks = users.map(u => {
    seen++;
    if (lastPoints === null || u.totalPoints < lastPoints) {
      rank = seen;
      lastPoints = u.totalPoints;
    }
    return { ...u, rank };
  });
  return withRanks;
}

async function stats() {
  const totalUsers = await User.countDocuments();
  const agg = await User.aggregate([
    { $group: { _id: null, sum: { $sum: "$totalPoints" }, max: { $max: "$totalPoints" } } }
  ]);
  const totalPoints = agg.length ? agg[0].sum : 0;
  const topScore = agg.length ? agg[0].max : 0;
  const pointClaims = await Claim.countDocuments();
  return { totalUsers, totalPoints, pointClaims, topScore };
}

// Seed 10 default users if none exist
router.post("/seed", async (req, res) => {
  const names = req.body?.names || ["Rahul","Kamal","Sanak","Ishwar","Aarav","Priya","Neha","Vikram","Ananya","Rohan"];
  const count = await User.countDocuments();
  if (count > 0) return res.json({ ok: true, message: "Already seeded" });
  const docs = await User.insertMany(names.map(n => ({ name: n })));
  res.json({ ok: true, users: docs });
});

// Create a user
router.post("/users", async (req, res) => {
  const { name } = req.body || {};
  if (!name?.trim()) return res.status(400).json({ error: "Name is required" });
  try {
    const user = await User.create({ name: name.trim() });
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// List users (unsorted) or leaderboard=true for sorted with rank
router.get("/users", async (req, res) => {
  const { leaderboard } = req.query;
  if (leaderboard === "true") {
    const lb = await buildLeaderboard();
    res.json(lb);
  } else {
    const users = await User.find().lean();
    res.json(users);
  }
});

// Claim random points for a user
router.post("/claim", async (req, res) => {
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: "userId is required" });
  const points = Math.floor(Math.random() * 10) + 1; // 1-10

  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { totalPoints: points } },
    { new: true }
  );
  if (!user) return res.status(404).json({ error: "User not found" });

  const claim = await Claim.create({ userId, points });

  const payload = {
    claim: { _id: claim._id, userId, userName: user.name, points, createdAt: claim.createdAt },
    leaderboard: await buildLeaderboard(),
    stats: await stats()
  };

  // notify sockets
  req.io?.emit("update", payload);

  res.json(payload);
});

// Get leaderboard
router.get("/leaderboard", async (req, res) => {
  const lb = await buildLeaderboard();
  res.json(lb);
});

// Get stats
router.get("/stats", async (req, res) => {
  res.json(await stats());
});

// Get claim history (paginated)
router.get("/history", async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Claim.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Claim.countDocuments()
  ]);
  // attach user names
  const ids = [...new Set(items.map(i => String(i.userId)))];
  const users = await User.find({ _id: { $in: ids } }).lean();
  const nameMap = Object.fromEntries(users.map(u => [String(u._id), u.name]));
  const rows = items.map(i => ({
    ...i,
    userName: nameMap[String(i.userId)] || "Unknown"
  }));
  res.json({ items: rows, total, page, pages: Math.ceil(total / limit) });
});
