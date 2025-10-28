import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  title: String,
  code: { type: String, unique: true },
  description: String,
  teacherId: String,
  members: [{ userId: String, roleInClass: String }]
});

export default mongoose.model("Class", classSchema);
