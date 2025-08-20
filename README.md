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

