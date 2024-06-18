const express = require("express");
const router = express.Router();
const Ticket = require("../models/Tickets");
const Board = require("../models/Board");

// Create a new ticket
router.post("/", async (req, res) => {
  const { title, description, status, board, assignee, dueDate } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  try {
    const boardData = await Board.findById(board);
    if (!boardData) {
      return res.status(404).json({ error: "Board not found" });
    }

    const ticketCount = await Ticket.countDocuments({ board });
    const ticketNumber = `${boardData.prefix}-${ticketCount + 1}`;

    const ticket = new Ticket({
      title,
      description,
      status,
      board,
      assignee,
      dueDate,
      ticketNumber,
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
    const ticket = await Ticket.findByIdAndUpdate(
      id,
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
      return res.status(404).json({ error: "Ticket not found" });
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
    });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all tickets for a specific board
router.get("/board/:boardId", async (req, res) => {
  const { boardId } = req.params;
  try {
    const tickets = await Ticket.find({ board: boardId });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a ticket
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findByIdAndDelete(id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
