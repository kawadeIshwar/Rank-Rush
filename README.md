
# Rank Rush (Full Stack)

React + Node + MongoDB + Socket.IO leaderboard app.

## Quick start

### 1) Server
```bash
cd server
npm i
cp .env.example .env
# edit .env if needed (Mongo URI / Client origin)
npm run dev
```
Seed default users (one time):
```
curl -X POST http://localhost:5000/api/seed
```

### 2) Client
```bash
cd client
npm i
# optionally: echo "VITE_API_URL=http://localhost:5000/api" > .env
npm run dev
```

Open http://localhost:5173
