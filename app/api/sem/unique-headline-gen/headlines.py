# Import necessary libraries
import openai
import re

# Set your OpenAI API key
openai.api_key = 'YOUR_API_KEY'

# Define the function to generate SEM headlines
def generate_sem_headlines(
    product_summary: str,
    keywords: list,
    existing_headlines: list,
    number_of_headlines: int = 10
) -> list:
    # Step 1: Generate new headlines
    prompt = f"""
As an SEM specialist, generate {number_of_headlines} unique and compelling headlines for the following product. Ensure that none of the headlines are duplicates of the existing headings provided. Use the product summary and keywords below to guide your headline creation. The headlines should be engaging and suitable for advertising. 

It is more important to write a compelling headline than it is to stuff a keyword into it.

Note also that the keywords may be awkwardly written. For example 'NAB Card' instead of the real name of the product.

Avoid using colons.

Ensure each headline does not exceed 30 characters (including spaces). Pay attention to the length of the existing headlines to estimate the character limit.

Avoid using cliche ad copy that mentions "today" or "now", or sounds over-enthusiastic. "Maximize Your Savings Now" would be better as "Maximize Your Savings"

PRODUCT SUMMARY:

{product_summary}

END PRODUCT SUMMARY

KEYWORDS:

{'\n\n'.join(keywords)}

END KEYWORDS

EXISTING HEADLINES:

{'\n\n'.join(existing_headlines)}

END EXISTING HEADLINES

Provide the headlines as a numbered list. 

Extend the list of headlines by {number_of_headlines} and keep to the same style as the existing headlines. Take note of the style, what works about them. You do not have to write a headline for every proof point in the product summary.

Begin by analysing the existing headlines between <thinking> </thinking> tags. Between those tags, identify the key features of the product that are being highlighted, if any very important ones are missed, and if they would resonate with the target audience if expressed as a headline. If the existing headlines have addressed key points, consider if they could also be expressed in a slightly different way. Plan what points you will address in the new headlines.

Then, between <headlines> </headlines> tags, provide the new headlines.
"""

    generated_headlines = []

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an SEM writing assistant."},
                {"role": "user", "content": prompt},
            ],
        )

        content = response['choices'][0]['message']['content'].strip()
        print(content)
        if content:
            # Extract headlines from the response
            headlines_match = re.search(r'<headlines>([\s\S]*?)<\/headlines>', content)
            if headlines_match and headlines_match.group(1):
                headlines_list = headlines_match.group(1).strip().split('\n')
                generated_headlines = [re.sub(r'^\d+\.\s*', '', line).strip() for line in headlines_list if line.strip()]
    except Exception as e:
        print("Error generating headlines:", e)
        raise e

    # Step 2: Separate headlines based on character limit
    usable_headlines = []
    over_limit_headlines = []

    for headline in generated_headlines:
        if len(headline) <= 30:
            if headline not in existing_headlines:
                usable_headlines.append(headline)
        else:
            over_limit_headlines.append({'original': headline})

    if over_limit_headlines:
        print("\n\nShortening headlines")
    else:
        print("\n\nNo headlines to shorten")

    # Step 3: Attempt to shorten over-limit headlines
    shortened_headlines = []
    for headline_data in over_limit_headlines:
        shortened = attempt_to_shorten_headline(headline_data['original'])
        if shortened:
            shortened_headlines.append({'original': headline_data['original'], 'shortened': shortened})

    print("\n\nShortened Headlines:", shortened_headlines)

    for shortened_headline in shortened_headlines:
        if shortened_headline and shortened_headline.get('shortened') not in existing_headlines:
            usable_headlines.append(shortened_headline.get('shortened'))

    # Ensure we have at least the desired number of headlines
    return usable_headlines[:number_of_headlines]

# Define the function to attempt to shorten a headline
def attempt_to_shorten_headline(headline: str) -> str:
    prompt = f"""
You are an expert copywriter. Your task is to shorten the following headline to 30 characters or fewer without losing its meaning or grammatical correctness. If it's not possible, respond with "UNABLE TO SHORTEN".

Headline: "{headline}"
"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an SEM headline shortening assistant"},
                {"role": "user", "content": prompt},
            ],
        )

        content = response['choices'][0]['message']['content'].strip()

        if content.upper() != "UNABLE TO SHORTEN" and len(content) <= 30:
            return content
        else:
            # Unable to shorten appropriately
            return None
    except Exception as e:
        print(f"Error shortening headline '{headline}':", e)
        return None

# Provide the product summary, keywords, and existing headlines
product_summary = """
Experience the freedom of low interest rates with the NAB Low Rate Card. This card offers an outstanding balance transfer offer that lets you save on interest with 0% p.a. for 28 months. Plus, enjoy no annual fee for the first year! You can also get up to $300 cash back in the first three months when you spend $500 per month on purchases. This card comes with top-notch fraud protection, ensuring 100% peace of mind with all your transactions. Add an additional cardholder at no extra cost and enjoy special offers on shows, events, experiences, and movies from Visa Entertainment. Apply now and experience the benefits of the NAB Low Rate Card.
"""

keywords = [
    "[nab rewards]",
    "[nab rewards card]",
    "[nab rewards credit card]",
    "[rewards card nab]",
    "[rewards nab credit card]",
    "[rewards credit card nab]",
]

existing_headlines = [
    "NAB Low Rate Card",
    "$0 First Year Annual Fee",
    "Switch to NAB Low Rate Today",
    "0% p.a. For 28 Months BT Offer",
    "NAB Balance Transfer Offers",
    "Get A Response In 60 Seconds",
    "NAB Balance Transfer Cards",
    "Up To 55 Interest Free Days",
    "Pay With Your Fav. Digi Wallet",
    "Balance Transfer NAB Card",
    "Enjoy our lowest Purchase Rate",
    "Great Balance Transfer Card",
    "Consolidate Cards with NAB",
    "Combine Your Debts Together",
    "Simplify Your Repayments",
]

# Call the function to generate headlines
number_of_headlines = 15
headline_result = generate_sem_headlines(
    product_summary=product_summary,
    keywords=keywords,
    existing_headlines=existing_headlines,
    number_of_headlines=number_of_headlines
)

# Print the resulting headlines
print("\n\nGenerated Headlines:")
for idx, headline in enumerate(headline_result, start=1):
    print(f"{idx}. {headline}")
