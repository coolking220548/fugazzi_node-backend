import express from "express";
import axios from "axios";
import cors from "cors";
import multer from "multer";

const app = express();
// const PYTHON_API_URL = "http://localhost:8001/";
const PYTHON_API_URL = "https://fugazzi-flask-backend.onrender.com/";

const PORT = process.env.PORT || 5001;

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.post("/api/newsAnalyze", async (req, res) => {
	try {
		const { text } = req.body;

		// Forward to FastAPI ML backend
		const response = await axios.post(`${PYTHON_API_URL}news/predict`, { text });

		res.json({
			original: text,
			prediction: response.data
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "ML service unavailable" });
	}
});

app.post("/api/newsScrape", async (req, res) => {
	try {
		const {url} = req.body;

		// Forward to FastAPI scraping backend
		const response = await axios.post(`${PYTHON_API_URL}news/scrape`, {url});

		res.json({
			original: url,
			articleText: response.data
		});
	} catch (error){
		console.error(error.message);
		res.status(500).json({ error: "Scraping service unavailable" });
	}
});

app.post("/api/newsTextExtraction", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({error: "No image uploaded"})
        }

        const base64image = req.file.buffer.toString("base64");

        const response = await axios.post(`${PYTHON_API_URL}news/textExtract`, {
            image: base64image,
        });

        res.json({
            original: req.file.originalname,
            classification: response.data
        })
    }catch (error){
		console.error(error.message);
		res.status(500).json({error: "Text Extraction service unavailable"});
    }
});

app.post("/api/urlAnalyze", async (req, res) => {
	try {
		const {url} = req.body;

		const response = await axios.post(`${PYTHON_API_URL}url/predict`, {url});

		res.json({
			original: url,
			classification: response.data
		});
	} catch (error){
		console.error(error.message);
		res.status(500).json({error: "URL authentication service unavailable"});
	}
});

app.post("/api/fbAnalyze", async (req, res) => {
	try {
		const {url} = req.body;

		const response = await axios.post(`${PYTHON_API_URL}fb/analyze`, {url});

		res.json({
			original: url,
			classification: response.data
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({error: "Facebook Account Authentication service unavailable"});
	}
});

app.post("/api/imageAnalyze", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({error: "No image uploaded"})
        }

        const base64image = req.file.buffer.toString("base64");

        const response = await axios.post(`${PYTHON_API_URL}image/analyze`, {
            image: base64image,
        });

        res.json({
            original: req.file.originalname,
            classification: response.data
        })
    }catch (error){
		console.error(error.message);
		res.status(500).json({error: "Image Authentication service unavailable"});
    }
});

app.get("/", (req, res) => {
  res.send("Node backend is running");
});

app.listen(PORT, () => {
  	console.log(`Node backend running on port ${PORT}`);
});