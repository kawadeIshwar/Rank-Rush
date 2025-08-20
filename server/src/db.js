
import mongoose from "mongoose";

export async function connectDB(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName: "rank_rush" });
  console.log("✅ MongoDB connected");
}
