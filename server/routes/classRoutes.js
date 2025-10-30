import express from "express";
import Class from "../models/Class.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all classes for user
router.get("/", auth, async (req, res) => {
  try {
    let classes;
    if (req.user.role === "admin") {
      classes = await Class.find().populate("teacherId", "name email");
    } else if (req.user.role === "teacher") {
      classes = await Class.find({ teacherId: req.user.userId });
    } else {
      classes = await Class.find({ members: req.user.userId });
    }
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create class
router.post("/", auth, async (req, res) => {
  try {
    const { title, code } = req.body;
    
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only teachers and admins can create classes" });
    }

    const existingClass = await Class.findOne({ code });
    if (existingClass) {
      return res.status(400).json({ message: "Class code already exists" });
    }

    const newClass = new Class({
      title,
      code,
      teacherId: req.user.userId,
      members: [],
      assignments: []
    });

    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Join class
router.post("/join", auth, async (req, res) => {
  try {
    const { code } = req.body;
    
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can join classes" });
    }

    const classToJoin = await Class.findOne({ code });
    if (!classToJoin) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (!classToJoin.members.includes(req.user.userId)) {
      classToJoin.members.push(req.user.userId);
      await classToJoin.save();
    }

    res.json({ message: "Successfully joined class", class: classToJoin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;