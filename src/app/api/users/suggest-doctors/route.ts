import { NextRequest, NextResponse } from "next/server";
import { AIDoctorAgents } from "../../../../../shared/list";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();
  const apiKey = process.env.OPEN_ROUTER_API_KEY;

  console.log("✅ suggest-doctors route hit");
  console.log("📝 Notes received:", notes);

  if (!apiKey) {
    console.error("❌ Missing OPEN_ROUTER_API_KEY");
    return NextResponse.json(
      { error: "Missing API Key" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model:  "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a medical assistant.

Use this doctor database:

${JSON.stringify(AIDoctorAgents)}

Return ONLY valid JSON.`,
            },
            {
              role: "user",
              content: `Given the user's symptoms: "${notes}", respond ONLY with JSON in this format:

{
  "suggested_doctors": [
    {
      "id": number,
      "specialist": "string"
    }
  ]
}

No markdown.
No explanation.
Only JSON.`,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("🔥 FULL OPENROUTER RESPONSE:", data);

    if (!response.ok) {
      console.error("❌ OpenRouter API Error:", data);

      return NextResponse.json(
        {
          error: data,
        },
        {
          status: response.status,
        }
      );
    }

    const rawResp =
      data?.choices?.[0]?.message?.content || "";

    console.log("🧠 RAW MODEL RESPONSE:", rawResp);

    if (!rawResp) {
      return NextResponse.json(
        {
          error: "No response from AI",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      rawResp,
    });
  } catch (error) {
    console.error("❌ Request error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}