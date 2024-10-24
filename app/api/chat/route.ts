import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";
import { cookies } from "next/headers";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const cookieStore = cookies();
  const hasAccess = cookieStore.get("hasAccess")?.value === "true" ?? false;
  if (!hasAccess) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o"),
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}
