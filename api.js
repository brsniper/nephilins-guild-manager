import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY environment variable is not set');
  process.exit(1);
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Generate logo endpoint
app.post('/api/generate-logo', async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: 'A highly modern, minimalist logo for a legendary guild Nephilins. Abstract fusion of angelic wings and a crystalline sword. Cyan and gold gradients on dark charcoal.' }],
      },
      config: { imageConfig: { aspectRatio: "1:1" } },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return res.json({
            success: true,
            logo: `data:image/png;base64,${part.inlineData.data}`
          });
        }
      }
    }

    res.status(500).json({ success: false, error: 'No image generated' });
  } catch (error) {
    console.error('Error generating logo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
