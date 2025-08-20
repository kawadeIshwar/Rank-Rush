import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/db.js";
import { router } from "./src/routes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// ✅ Allow both local frontend (for dev) and Netlify frontend (for prod)
const allowedOrigins = [
  "http://localhost:5173",   // Vite dev server
  "http://localhost:3000",   // React dev server
  "https://rank-rush1.netlify.app" // Production
];

const app = express();
const server = http.createServer(app);

// ✅ Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// ✅ Middleware
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// ✅ Attach socket.io instance to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ API routes
app.use("/api", router);

// ✅ Health check
app.get("/", (req, res) => res.send("🚀 Rank Rush API is running"));

// ✅ Start server
async function start() {
  try {
    await connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/rank_rush");
    server.listen(PORT, () => {
      console.log(`🚀 Server on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
