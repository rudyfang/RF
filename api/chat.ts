import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { message } = req.body as { message?: string };

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Missing 'message' in request body" });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "Server missing GEMINI_API_KEY" });
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent(message);
    const reply = result.response.text();

    res.status(200).json({ reply });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Unknown error" });
  }
}

