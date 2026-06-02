const ENDPOINT = "https://api.openai.com/v1/chat/completions";

export async function completeJson<T>(
  system: string,
  user: string,
): Promise<T | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) return null;

  try {
    const body = await res.json();
    const text = body.choices?.[0]?.message?.content;
    return text ? (JSON.parse(text) as T) : null;
  } catch {
    return null;
  }
}
