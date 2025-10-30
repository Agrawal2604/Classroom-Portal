import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, unique: true, required: true },
  description: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }]
}, { timestamps: true });

export default mongoose.model("Class", classSchema);
