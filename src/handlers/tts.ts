import { createAudioStream } from "../lib/tts";
import { CORS_HEADERS, errorResponse } from "../lib/http";

type TtsBody = {
  text?: unknown;
  voice?: unknown;
};

function parseBody(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("request body must be an object");
  }

  const { text, voice } = body as TtsBody;

  if (typeof text !== "string" || text.trim().length === 0) {
    throw new Error("text is required");
  }

  if (voice !== undefined && typeof voice !== "string") {
    throw new Error("voice must be a string");
  }

  return {
    text: text.trim(),
    voice,
  };
}

export async function handleTts(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return errorResponse(
      400,
      "INVALID_CONTENT_TYPE",
      "content-type must be application/json"
    );
  }

  let parsed: ReturnType<typeof parseBody>;

  try {
    parsed = parseBody(await request.json());
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "request body must be valid json";

    return errorResponse(400, "INVALID_REQUEST", message);
  }

  try {
    const stream = await createAudioStream(parsed);

    return new Response(stream, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "audio/mpeg",
      },
    });
  } catch {
    return errorResponse(502, "TTS_UPSTREAM_ERROR", "failed to synthesize audio");
  }
}
