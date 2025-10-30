import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  linkOrFiles: [{
    type: { type: String, enum: ["link", "file"] },
    url: String,
    meta: {
      name: String,
      size: Number,
      type: String
    }
  }],
  submittedAt: { type: Date, default: Date.now },
  late: { type: Boolean, default: false },
  status: { type: String, enum: ["submitted","graded"], default: "submitted" },
  grade: { 
    score: Number, 
    max: { type: Number, default: 100 }
  },
  feedback: String,
  gradedAt: Date
}, { timestamps: true });

export default mongoose.model("Submission", submissionSchema);
