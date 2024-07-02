const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const Board = require("../models/Board");
const Counter = require("../models/Counter");
const authMiddleware = require("../middleware/authMiddleware");

// Protect routes with authMiddleware
router.use(authMiddleware);

// Create a new ticket
router.post("/", async (req, res) => {
  const { title, description, status, board, assignee, dueDate } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  try {
    // Check if the user has access to the board
    const boardData = await Board.findOne({ _id: board, user: req.user._id });
    if (!boardData) {
      return res
        .status(404)
        .json({ error: "Board not found or access denied" });
    }

    const counter = await Counter.findOneAndUpdate(
      { board },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const ticketNumber = `${boardData.prefix}-${counter.seq}`;
    const ticket = new Ticket({
      title,
      description,
      status,
      board,
      assignee,
      dueDate,
      ticketNumber,
      user: req.user._id,
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an existing ticket
const sanitizeHtml = require("sanitize-html");

// Update an existing ticket
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, status, board, assignee, dueDate } = req.body;
  try {
    const sanitizedDescription = sanitizeHtml(description);
    const ticket = await Ticket.findOneAndUpdate(
      { _id: id, user: req.user._id },
      {
        title,
        description: sanitizedDescription,
        status,
        board,
        assignee,
        dueDate,
      },
      { new: true }
    );
    if (!ticket) {
      return res
        .status(404)
        .json({ error: "Ticket not found or unauthorized" });
    }
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:ticketNumber", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      ticketNumber: req.params.ticketNumber,
      user: req.user._id,
    });
    if (!ticket) {
      return res
        .status(404)
        .json({ message: "Ticket not found or unauthorized" });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all tickets for a specific board
router.get("/board/:boardId", async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      user: req.user._id,
    });
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    const tickets = await Ticket.find({ board: board._id, user: req.user._id });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a ticket
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });
    if (!ticket) {
      return res
        .status(404)
        .json({ error: "Ticket not found or unauthorized" });
    }
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
