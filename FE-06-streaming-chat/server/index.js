import express from "express";
import { BASE_URL, MODEL, API_KEY, SYSTEM_PROMPT, MAX_HISTORY } from "./config.js";

const app = express();
app.use(express.json({ limit: "1mb" }));

if (!API_KEY) {
  console.error("AI_API_KEY missing. server/.env file banao (.env.example dekho).");
  process.exit(1);
}

// POST /api/chat  { messages: [{role, content}, ...] }
// Jawab plain text stream hota hai: jaise jaise model likhta hai, waise hi client ko milta hai.
app.post("/api/chat", async (req, res) => {
  const incoming = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const messages = incoming
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content }));

  if (messages.length === 0) return res.status(400).json({ error: "No messages" });

  // Client ne Stop dabaya (ya tab band kiya) to provider ko bhi rok do.
  const upstreamAbort = new AbortController();
  res.on("close", () => upstreamAbort.abort());

  let upstream;
  try {
    upstream = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      signal: upstreamAbort.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
    });
  } catch (err) {
    if (err.name === "AbortError") return;
    return res.status(502).json({ error: "Provider se connect nahi ho saka." });
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error("Provider error", upstream.status, detail.slice(0, 300));
    return res.status(502).json({ error: `Provider error (${upstream.status}). Key ya model name check karo.` });
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  // Provider SSE bhejta hai ("data: {...}" lines). Hum sirf text nikal ke aage bhejte hain.
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    for await (const chunk of upstream.body) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop(); // adhoori line agle chunk ke liye
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
          const text = JSON.parse(data).choices?.[0]?.delta?.content;
          if (text) res.write(text);
        } catch {
          /* adhoora JSON ignore */
        }
      }
    }
  } catch (err) {
    if (err.name !== "AbortError") console.error("Stream error", err.message);
  }
  res.end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server chal raha hai: http://localhost:${PORT}`));
