import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  classId: String,
  title: String,
  description: String,
  dueAt: Date,
  attachments: [String],
  createdBy: String
});

export default mongoose.model("Assignment", assignmentSchema);
