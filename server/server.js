import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/db.js";
import { router } from "./src/routes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// ✅ Explicitly allow dev + prod frontends
const allowedOrigins = [
  "http://localhost:5173",          // Vite dev server
  "https://rank-rush1.netlify.app", // Netlify production
];

const app = express();
const server = http.createServer(app);

// ✅ API CORS
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ✅ Parse JSON requests
app.use(express.json());

// ✅ Socket.io CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
});

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
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // Debug socket connections
    io.on("connection", (socket) => {
      console.log(`✅ Socket connected: ${socket.id}`);
      socket.on("disconnect", () => {
        console.log(`❌ Socket disconnected: ${socket.id}`);
      });
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
