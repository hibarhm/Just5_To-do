// src/routes/tasks.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET all tasks (optional; used for listing)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tasks ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// POST create task
router.post("/", async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: "Title is required" });
    }

    // allow nullable date and description
    const [result] = await pool.query(
      "INSERT INTO tasks (title, description, date) VALUES (?, ?, ?)",
      [title.trim(), description || null, date || null]
    );

    // fetch the created row to return full data including created_at
    const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB insert failed" });
  }
});

// DELETE task (optional)
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB delete failed" });
  }
});

export default router;
