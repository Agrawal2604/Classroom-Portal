import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  title: { type: String, required: true },
  description: String,
  dueAt: { type: Date, required: true },
  attachments: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  visibility: { type: String, enum: ["class", "private"], default: "class" }
}, { timestamps: true });

export default mongoose.model("Assignment", assignmentSchema);
