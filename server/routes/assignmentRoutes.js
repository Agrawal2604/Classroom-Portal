import express from "express";
import Assignment from "../models/Assignment.js";
import Class from "../models/Class.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get assignments for a class
router.get("/class/:classId", auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ classId: req.params.classId });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create assignment
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, dueAt, classId } = req.body;
    
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only teachers can create assignments" });
    }

    const assignment = new Assignment({
      title,
      description,
      dueAt,
      classId,
      createdBy: req.user.userId,
      attachments: [],
      visibility: "class"
    });

    await assignment.save();
    
    // Add to class assignments array
    await Class.findByIdAndUpdate(classId, { $push: { assignments: assignment._id } });
    
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;