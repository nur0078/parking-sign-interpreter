const express = require("express");
const cors = require("cors");
const signInterpreterRoutes = require("./routes/signInterpreter");
const errorHandler = require("./middlewares/errorHandler");
const { PORT } = require("./config/env");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api", signInterpreterRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
