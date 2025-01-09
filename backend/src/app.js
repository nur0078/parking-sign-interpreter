const express = require("express");
const cors = require("cors");
const signInterpreterRoutes = require("./routes/signInterpreter");
const errorHandler = require("./middlewares/errorHandler");
const { PORT } = require("./config/env");

const app = express();

// Configure CORS to allow requests from mobile devices
app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.1.7:5173"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Increase payload limit for images
app.use(express.json({ limit: "10mb" }));

app.use("/api", signInterpreterRoutes);
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access from mobile: http://192.168.1.7:${PORT}`);
});
