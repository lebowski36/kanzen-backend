const express = require("express");
const router = express.Router();
const Board = require("../models/Board");
const authMiddleware = require("../middleware/authMiddleware");

// Protect routes with authMiddleware
router.use(authMiddleware);

// Create a new board
router.post("/", async (req, res) => {
  const { name, description, prefix, columns } = req.body;
  try {
    const board = new Board({
      name,
      description,
      prefix,
      columns,
      user: req.user._id,
    });
    await board.save();
    res.status(201).json(board);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Prefix already in use for this user." });
    }
    res.status(400).json({ error: err.message });
  }
});

// Get all boards
router.get("/", async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user._id });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific board by ID
router.get("/:id", async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
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
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { columns },
      { new: true }
    );
    if (!board) {
      return res.status(404).json({
        error:
          "Board not found or you do not have permission to update this board",
      });
    }
    res.json(board);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a board
router.delete("/:id", async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!board) {
      return res.status(404).json({
        error:
          "Board not found or you do not have permission to delete this board",
      });
    }
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
