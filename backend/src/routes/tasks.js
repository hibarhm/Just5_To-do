import express from "express";
import { pool } from "../db.js";

const router = express.Router();


// GET tasks
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM task ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "DB error" });
  }
});


// Create new task

router.post("/", async (req, res) => {
  try {
    const { title, description, date } = req.body;

    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (date && isNaN(Date.parse(date))) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const [result] = await pool.query(
      "INSERT INTO task (title, description, date) VALUES (?, ?, ?)",
      [title.trim(), description || null, date || null]
    );

    // Fetch the created row
    const [rows] = await pool.query("SELECT * FROM task WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "DB insert failed" });
  }
});


// PUT edit/update task

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date } = req.body;

    // If JSON body is provided → edit
    if (title || description || date) {
      if (!title || title.trim().length === 0) {
        return res.status(400).json({ error: "Title is required" });
      }

      const [result] = await pool.query(
        "UPDATE task SET title = ?, description = ?, date = ? WHERE id = ?",
        [title.trim(), description || null, date || null, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Task not found" });
      }

      const [rows] = await pool.query("SELECT * FROM task WHERE id = ?", [id]);
      return res.json(rows[0]);
    }

    // No body → mark done in UI only (frontend removes it)
    return res.json({ success: true });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "DB update failed" });
  }
});

// DELETE task

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM task WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "DB delete failed" });
  }
});

export default router;
