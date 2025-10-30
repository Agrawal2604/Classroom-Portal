import express from "express";
import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get submissions for an assignment
router.get("/assignment/:assignmentId", auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.assignmentId })
      .populate("studentId", "name email");
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create submission
router.post("/", auth, async (req, res) => {
  try {
    const { assignmentId, linkOrFiles } = req.body;
    
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit assignments" });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const now = new Date();
    const due = new Date(assignment.dueAt);
    const late = now > due;

    const submission = new Submission({
      assignmentId,
      studentId: req.user.userId,
      linkOrFiles,
      submittedAt: now,
      late,
      status: "submitted"
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;