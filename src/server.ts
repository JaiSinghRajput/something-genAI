// server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { generateAIImages, generateAIVideo } from "./utils/genAI";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve generated files statically
app.use("/generated", express.static(path.join(__dirname, "..")));

/**
 * POST /generate-images
 * body: { prompt: string, numberOfImages?: number }
 */
app.post("/generate-images", async (req, res) => {
  try {
    const { prompt, numberOfImages } = req.body;
    const images = await generateAIImages(prompt, numberOfImages);
    res.json({ images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * POST /generate-video
 * body: { prompt: string }
 */
app.post("/generate-video", async (req, res) => {
  try {
    const { prompt } = req.body;
    const videoPath = await generateAIVideo(prompt);
    res.json({ video: videoPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI backend running on http://localhost:${PORT}`);
});
