import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.post("/api/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    // Forward to FastAPI ML backend
    const response = await axios.post("http://localhost:8001/detect", { text });

    res.json({
      original: text,
      prediction: response.data
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "ML service unavailable" });
  }
});

app.listen(PORT, () => {
  console.log(`Node backend running at http://localhost:${PORT}`);
});
