const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Board = require("./models/Board");
const Ticket = require("./models/Ticket");

dotenv.config(); // Load environment variables

const userId = "6683179a6503075fba012f9f"; // The specified user ID

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");

    try {
      await Board.updateMany({}, { user: userId });
      await Ticket.updateMany({}, { user: userId });
      console.log("Migration completed successfully");
    } catch (error) {
      console.error("Migration failed:", error);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
