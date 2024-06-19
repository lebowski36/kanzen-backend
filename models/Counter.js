const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  board: { type: mongoose.Schema.Types.ObjectId, ref: "Board", unique: true },
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter", CounterSchema);
