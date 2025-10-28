import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ["student","teacher","admin"], default: "student" }
});

export default mongoose.model("User", userSchema);
