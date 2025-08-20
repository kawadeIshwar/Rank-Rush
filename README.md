# 🏆 Rank-Rush (Leaderboard Task)

## 📌 Task Objective
Build a **Leaderboard System** where:
- A user can select one of ten predefined users.
- Claim **random points** (between 1 to 10) for that selected user.
- The **leaderboard updates dynamically** to reflect new rankings based on total points.

- **Backend:** NodeJS (Express, MongoDB)  
- **Frontend:** ReactJS (Basic UI)  

---

## 🚀 Features Overview

### ✅ User Selection
- Display a list of **10 initial users** in the UI.  
- Option to **add new users** from the frontend (new users are stored in the database).  

### ✅ Claim Points
- A **"Claim" button** allows awarding random points (1–10) to a selected user.  
- On every claim:
  - User’s total points update in the database.  
  - A **claim history record** is stored in a separate collection.  

### ✅ Leaderboard
- Displays:
  - User Name  
  - Total Points  
  - Rank  
- Automatically updates in **real-time** when points are claimed.  

### ✅ Database (MongoDB)
- **Users Collection** → Stores user details + total points.  
- **History Collection** → Stores every claim action with timestamp.  

---

## ⚙️ Backend (NodeJS)

### Collections
**User Example:**
```json
{
  "name": "Rahul",
  "totalPoints": 25
}
```

**History Example:**
```json
{
  "userId": "12345",
  "pointsClaimed": 7,
  "timestamp": "2025-08-21T10:00:00Z"
}
```

**Core Logic**

-Random Points: Each claim assigns Math.floor(Math.random() * 10) + 1.

-Ranking Calculation: Users sorted in descending order of total points.

-Real-Time Updates: API returns updated leaderboard after every claim.

*🎨 Frontend (ReactJS)*
**Components**

-User List (Dropdown/List): Select a user.

-Add User: Create new user from frontend.

*Claim Button:*

-Calls backend API with selected user’s ID.

-Displays awarded random points.

*Leaderboard:*

-Shows rank, username, and total points.

-Updates dynamically after each claim.


## 🖥️ Setup Instructions
### 1️⃣ Clone Repository
```bash
git clone https://github.com/kawadeIshwar/Rank-Rush.git
cd Rank-Rush
```
### 2️⃣ Backend Setup
```bash
cd backend
npm install
```
*Create a .env file inside backend/ with:*
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
```
*Start server:*
```
npm start
```
*Backend runs on * → http://localhost:5000

### 3️⃣ Frontend Setup
```
cd frontend
npm install
```
*Create a .env file inside frontend/ with:*
```
VITE_API_URL=http://localhost:5000
```
*Start frontend:*
```
npm run dev
```
*Frontend runs on → http://localhost:5173*
