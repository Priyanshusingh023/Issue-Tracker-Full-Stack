// ===== 1. Imports =====
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===== 2. App initialization =====
const app = express();
const PORT = 5000;

app.use(express.json());   // must be BEFORE routes
app.use(cors());

// ===== 3. MongoDB connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ===== 4. Schemas & Models =====
const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  place: { type: String, required:true },
  status: {
    type: String,
    default: "open"
  }
});
const Issue = mongoose.model("Issue", issueSchema);

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});
const User = mongoose.model("User", userSchema);

// ===== 5. JWT Secret =====
const JWT_SECRET = "yogdaan_secret_key";

// ===== Auth Middleware =====
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Support "Bearer <token>" or raw token
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// ===== 6. Register Route =====
app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });

    await newUser.save();
    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== 7. Login Route =====
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== 8. Issue Routes =====
app.get("/issues", authMiddleware, async (req, res) => {
  try {
    const issues = await Issue.find();
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create issue with title, description and place
app.post("/issues", authMiddleware, async (req, res) => {
  try {
    const { title, description, place } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const newIssue = new Issue({ title, description, place });
    const savedIssue = await newIssue.save();
    res.json(savedIssue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/issues/:id/status", authMiddleware, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    issue.status = issue.status === "open" ? "resolved" : "open";
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Optional: update description/place (partial update)
app.patch("/issues/:id", authMiddleware, async (req, res) => {
  try {
    const updates = {};
    if (typeof req.body.title !== "undefined") updates.title = req.body.title;
    if (typeof req.body.description !== "undefined") updates.description = req.body.description;
    if (typeof req.body.place !== "undefined") updates.place = req.body.place;
    if (Object.keys(updates).length === 0) return res.status(400).json({ message: "No valid fields to update" });

    const issue = await Issue.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/issues/:id", authMiddleware, async (req, res) => {
  try {
    await Issue.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== 9. Server Start =====
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});