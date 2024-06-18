const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: "To Do" },
  board: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now },
  linkedTickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
  ticketNumber: { type: String, required: true },
});

module.exports = mongoose.model("Ticket", TicketSchema);
