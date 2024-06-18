const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  prefix: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 5,
    unique: true,
  }, // New field
  createdAt: { type: Date, default: Date.now },
  columns: { type: [String], default: ["To Do", "In Progress", "Done"] }, // Add default columns
});

module.exports = mongoose.model("Board", BoardSchema);
