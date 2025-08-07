const express = require("express");
require("dotenv").config();
const aiRoutes = require("./src/routes/ai.routes"); // ✅ Correct path

const app = express();
const PORT = 3000;

app.use('/ai', aiRoutes); // ✅ Use the router

app.listen(PORT, () => {
  console.log("server started");
});