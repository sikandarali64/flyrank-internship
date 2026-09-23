import OpenAI from "openai";

function extractJson(content: string): unknown {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : content;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new SyntaxError("No JSON object found in AI response");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

export async function POST(request: Request) {
  let resumeText: unknown;

  try {
    const body = await request.json();
    resumeText = (body as { resumeText?: unknown }).resumeText;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof resumeText !== "string" || resumeText.trim().length === 0) {
    return Response.json({ error: "resumeText is required" }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return Response.json(
      { error: "GEMINI_API_KEY is not set" },
      { status: 500 },
    );
  }

  const gemini = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
  });

  const models =
    process.env.GEMINI_MODEL?.split(",").map((m) => m.trim()) ??
    ["gemini-3.6-flash", "gemini-flash-latest", "gemini-3-pro"];

  try {
    let lastError: unknown;
    for (const model of models) {
      try {
        const response = await gemini.chat.completions.create({
          model,
          max_tokens: 1024,
          messages: [
            {
              role: "system",
              content:
                "You are an expert resume reviewer. Return ONLY a JSON object with keys: score (number 0-100), strengths (array of strings), weaknesses (array of strings), missing_skills (array of strings). Do not include markdown or extra text.",
            },
            {
              role: "user",
              content: `Analyze the following resume and provide a score (0-100), strengths, weaknesses, and missing skills:\n\n${resumeText}`,
            },
          ],
          response_format: {
            type: "json_object",
          },
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
          return Response.json(extractJson(content));
        }
      } catch (error) {
        if (
          error instanceof OpenAI.APIError &&
          (error.status === 503 || error.status === 429 || error.status === 404)
        ) {
          lastError = error;
          continue;
        }
        console.error(`Gemini API call failed (${model}):`, error);
        throw error;
      }
    }

    console.error("Gemini API: all models unavailable:", lastError);
    return Response.json(
      {
        error:
          "All Gemini models are currently overloaded. Please try again later.",
      },
      { status: 503 },
    );
  } catch (error) {
    console.error("Gemini API call failed:", error);

    let message = "AI analysis failed";
    if (error instanceof OpenAI.APIError) {
      message = error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return Response.json({ error: message }, { status: 502 });
  }
}