
import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  points: { type: Number, required: true },
}, { timestamps: true });

export const Claim = mongoose.model("Claim", claimSchema);
