const express = require("express");
const cors = require("cors");
const signInterpreterRoutes = require("./routes/signInterpreter");
const errorHandler = require("./middlewares/errorHandler");
const { PORT } = require("./config/env");

const app = express();

// Configure CORS to allow requests from all origins during development
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://parking-sign-interpreter-r9jchbyu6-nur0078s-projects.vercel.app",
      "https://parking-sign-interpreter.vercel.app",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Increase payload limit for images
app.use(express.json({ limit: "10mb" }));

app.use("/api", signInterpreterRoutes);
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
