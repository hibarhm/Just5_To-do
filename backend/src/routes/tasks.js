import express from "express";
import { pool } from "../db.js"; // make sure db.js exports { pool }

const router = express.Router();

// --- GET all tasks ---
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM task ORDER BY created_at DESC");
    // map completed → done for frontend
    const tasks = rows.map(r => ({ ...r, done: r.completed }));
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "DB error" });
  }
});

// --- POST create task ---
router.post("/", async (req, res) => {
  try {
    const { title, description, date } = req.body;

    // --- Validation ---
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (date && isNaN(Date.parse(date))) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // --- Insert task using prepared statement ---
    const [result] = await pool.query(
      "INSERT INTO task (title, description, date) VALUES (?, ?, ?)",
      [title.trim(), description || null, date || null]
    );

    // --- Fetch the created row ---
    const [rows] = await pool.query("SELECT * FROM task WHERE id = ?", [result.insertId]);
    const createdTask = { ...rows[0], done: rows[0].completed };

    res.status(201).json(createdTask);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "DB insert failed" });
  }
});

// --- PUT update task as completed ---
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("UPDATE task SET completed = TRUE WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "DB update failed" });
  }
});

// --- DELETE task ---
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM task WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.sendStatus(204); // No content
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "DB delete failed" });
  }
});

export default router;
