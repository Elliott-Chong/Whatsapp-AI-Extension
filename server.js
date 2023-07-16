const express = require("express");
const cors = require("cors");
const app = express();
const { autoComplete } = require("./vertex.js");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.post("/api/ai_complete", async (req, res) => {
  try {
    const { history, output_user } = req.body;
    const data = await autoComplete(history, output_user);
    return res.json(data);
  } catch (error) {
    console.error(error);
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
