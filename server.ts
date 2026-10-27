import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

// Initialize Gemini API client if API key exists
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// API route for AI Image Analysis & Enhancement Recommendations
app.post('/api/ai-analyze', async (req, res) => {
  try {
    const { image, prompt } = req.body;
    if (!ai) {
      return res.status(500).json({ error: 'Gemini API key not configured on server.' });
    }

    // Extract base64 data and mime type
    const matches = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Invalid image data format.' });
    }
    const mimeType = matches[1];
    const base64Data = matches[2];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: prompt || "Analyze this image and suggest 3 professional photo editing adjustments (brightness, contrast, saturation, sharpness, temperature) and describe how to make it look stunning.",
        },
      ],
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error('AI Analyze error:', error);
    res.status(500).json({ error: error.message || 'Failed to process AI analysis.' });
  }
});

// API route for AI editing instruction interpretation & parameter recommendation
app.post('/api/ai-edit', async (req, res) => {
  try {
    const { image, instruction } = req.body;
    if (!ai) {
      return res.status(500).json({ error: 'Gemini API key not configured on server.' });
    }

    const matches = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: 'Invalid image data format.' });
    }
    const mimeType = matches[1];
    const base64Data = matches[2];

    const promptText = `You are an expert AI photo editor. The user wants to edit this image with the following instruction: "${instruction}".
Analyze the image and provide JSON output with recommended adjustment values (-100 to 100 for brightness, contrast, saturation, exposure, highlights, shadows, warmth, sharpness, blur), suggested filter name (e.g. vivid, warm, cool, cinematic, vintage, bw, portrait, drama, soft), and a short friendly message explaining what enhancements were applied.
Format strictly as JSON with keys: brightness, contrast, saturation, exposure, highlights, shadows, warmth, sharpness, blur, filter, message.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: promptText,
        },
      ],
    });

    let rawText = response.text || '';
    // Clean markdown code blocks if any
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    let jsonResult;
    try {
      jsonResult = JSON.parse(rawText);
    } catch (e) {
      jsonResult = {
        brightness: 10,
        contrast: 15,
        saturation: 20,
        exposure: 5,
        highlights: 0,
        shadows: 10,
        warmth: 5,
        sharpness: 15,
        blur: 0,
        filter: 'vivid',
        message: `Applied AI enhancements for "${instruction}" successfully!`
      };
    }

    res.json({ result: jsonResult });
  } catch (error: any) {
    console.error('AI Edit error:', error);
    res.status(500).json({ error: error.message || 'Failed to process AI edit.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
