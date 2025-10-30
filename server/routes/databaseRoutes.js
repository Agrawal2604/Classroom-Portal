import express from "express";
import auth from "../middleware/auth.js";
import { getDatabaseStats, getUserDashboardData } from "../database/utils.js";

const router = express.Router();

// Get database statistics (admin only)
router.get("/stats", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const stats = await getDatabaseStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user dashboard data
router.get("/dashboard", auth, async (req, res) => {
  try {
    const dashboardData = await getUserDashboardData(req.user.userId, req.user.role);
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user profile with related data
router.get("/profile", auth, async (req, res) => {
  try {
    const profileData = await getUserDashboardData(req.user.userId, req.user.role);
    res.json({
      user: {
        id: req.user.userId,
        role: req.user.role
      },
      data: profileData
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;