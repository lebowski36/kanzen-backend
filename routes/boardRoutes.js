const express = require("express");
const router = express.Router();
const Board = require("../models/Board");

// Create a new board
router.post("/", async (req, res) => {
  const { name, description, prefix, columns } = req.body; // Accept columns
  try {
    const board = new Board({ name, description, prefix, columns }); // Save columns
    await board.save();
    res.status(201).json(board);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all boards
router.get("/", async (req, res) => {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific board by ID
router.get("/:id", async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.json(board);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a board with custom columns
router.put("/:id", async (req, res) => {
  const { columns } = req.body;
  try {
    const board = await Board.findByIdAndUpdate(
      req.params.id,
      { columns },
      { new: true }
    );
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.json(board);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a board
router.delete("/:id", async (req, res) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
