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
  },
  createdAt: { type: Date, default: Date.now },
  columns: { type: [String], default: ["To Do", "In Progress", "Done"] }, // Handle columns array
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Board", BoardSchema);
