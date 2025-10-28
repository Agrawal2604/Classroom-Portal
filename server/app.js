import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error(err));

app.get("/", (req, res) => res.send("Classroom Assignment Portal API Running"));

// app.use("/api/auth", authRoutes);
// app.use("/api/classes", classRoutes);
// app.use("/api/assignments", assignmentRoutes);
// app.use("/api/submissions", submissionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
export default app;