import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  assignmentId: String,
  studentId: String,
  linkOrFiles: [String],
  submittedAt: Date,
  status: { type: String, enum: ["submitted","graded"], default: "submitted" },
  grade: { score: Number, max: Number },
  feedback: String
});

export default mongoose.model("Submission", submissionSchema);
