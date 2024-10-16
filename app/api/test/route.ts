import OpenAI from "openai";
const openai = new OpenAI();

interface HeadlineData {
  original: string;
  shortened?: string;
}

async function generateSEMHeadlines(
  productSummary: string,
  keywords: string[],
  existingHeadlines: string[],
  numberOfHeadlines: number = 10
): Promise<string[]> {
  // Step 1: Generate new headlines
  const prompt = `
As an SEM specialist, generate ${numberOfHeadlines} unique and compelling headlines for the following product. Ensure that none of the headlines are duplicates of the existing headings provided. Use the product summary and keywords below to guide your headline creation. The headlines should be engaging and suitable for advertising. 

It is more important to write a compelling headline than it is to stuff a keyword into it. 

Avoid using colons.

Ensure each headline does not exceed 30 characters (including spaces). Do not exceed this limit under any circumstance.

Avoid using cliche ad copy that is too mentions "today" or "now", or sounding over enthusiastic. "Maximize Your Savings Now" would be better as "Maximize Your Savings"

PRODUCT SUMMARY:

Experience the freedom of low interest rates with the NAB Low Rate Card. This card offers an outstanding balance transfer offer that lets you save on interest with 0% p.a. for 28 months. Plus, enjoy no annual fee for the first year! You can also get up to $300 cash back in the first three months when you spend $500 per month on purchases. This card comes with top-notch fraud protection, ensuring 100% peace of mind with all your transactions. Add an additional cardholder at no extra cost and enjoy special offers on shows, events, experiences, and movies from Visa Entertainment. Apply now and experience the benefits of the NAB Low Rate Card.  

KEYWORDS:

[nab rewards]  

[nab rewards card]  

[nab rewards credit card]  

[rewards card nab]  

[rewards nab credit card]  

[rewards credit card nab] 

EXISTING HEADLINES:

NAB Low Rate Card 

$0 First Year Annual Fee 

Switch to NAB Low Rate Today 

0% p.a. For 28 Months BT Offer 

NAB Balance Transfer Offers 

Get A Response In 60 Seconds 

NAB Balance Transfer Cards 

Up To 55 Interest Free Days 

Pay With Your Fav. Digi Wallet 

Balance Transfer NAB Card 

Enjoy our lowest Purchase Rate 

Great Balance Transfer Card 

Consolidate Cards with NAB 

Combine Your Debts Together 

Simplify Your Repayments 

Provide the headlines as a numbered list.
`;

  let generatedHeadlines: string[] = [];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    const response = completion.choices[0].message.content?.trim();
    console.log(response);
    if (response) {
      // Extract headlines from the response
      const lines = response.split("\n");
      for (const line of lines) {
        const match = line.match(/^\d+\.\s*(.*)/);
        if (match && match[1]) {
          generatedHeadlines.push(match[1].trim());
        }
      }
    }
  } catch (error) {
    console.error("Error generating headlines:", error);
    throw error;
  }

  // Step 2: Separate headlines based on character limit
  const usableHeadlines: string[] = [];
  const overLimitHeadlines: HeadlineData[] = [];

  for (const headline of generatedHeadlines) {
    if (headline.length <= 30) {
      if (!existingHeadlines.includes(headline)) {
        usableHeadlines.push(headline);
      }
    } else {
      overLimitHeadlines.push({ original: headline });
    }
  }

  console.log(overLimitHeadlines.length !== 0 ? "\n\nshortening headlines" : '\n\nno headlines to shorten');

  // Step 3: Attempt to shorten over-limit headlines
  const shortenedHeadlinesPromises = overLimitHeadlines.map(
    async (headlineData) => {
      const shortened = await attemptToShortenHeadline(headlineData.original);
      return { original: headlineData.original, shortened };
    }
  );

  const shortenedHeadlines = await Promise.all(shortenedHeadlinesPromises);
  console.log("\n\nShortened", shortenedHeadlines);

  shortenedHeadlines.forEach((shortenedHeadline) => {
    if (
      shortenedHeadline &&
      !existingHeadlines.includes(shortenedHeadline.shortened || "")
    ) {
      usableHeadlines.push(shortenedHeadline.shortened || "");
    }
  });

  // Ensure we have at least the desired number of headlines
  return usableHeadlines.slice(0, numberOfHeadlines);
}

async function attemptToShortenHeadline(
  headline: string
): Promise<string | null> {
  const prompt = `
You are an expert copywriter. Your task is to shorten the following headline to 30 characters or fewer without losing its meaning or grammatical correctness. If it's not possible, respond with "UNABLE TO SHORTEN".

Headline: "${headline}"
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an SEM headline shortening assistant",
        },
        { role: "user", content: prompt },
      ],
    });

    const response = completion.choices[0].message?.content?.trim();

    if (
      response &&
      response.toUpperCase() !== "UNABLE TO SHORTEN" &&
      response.length <= 30
    ) {
      return response;
    } else {
      // Unable to shorten appropriately
      return null;
    }
  } catch (error) {
    console.error(`Error shortening headline "${headline}":`, error);
    return null;
  }
}

export async function GET() {
  try {
    const headlineResult = await generateSEMHeadlines("", [], [], 15);
    return Response.json(headlineResult);
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
  }
}
