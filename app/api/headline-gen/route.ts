import OpenAI from "openai";
const openai = new OpenAI();

export async function GET(req: Request) {
  const { messages, productSummary, existingHeadlines } = await req.json();

  // Generate headlines using OpenAI
  const headlinePrompt = `
    Generate at least 10 unique and compelling headlines for the following product:
    
    ${productSummary}
    
    Existing headlines:
    ${existingHeadlines.join('\n')}
    
    Ensure that none of the headlines are duplicates of the existing headings provided.
    The headlines should be engaging, suitable for advertising, and not exceed 30 characters.
    Use a numbered list.
  `;

  const headlineResult = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: "Write a haiku about recursion in programming.",
        },
    ],
});

  const generatedHeadlines = headlineResult.choices[0].message.content;

  return new Response(generatedHeadlines);
}