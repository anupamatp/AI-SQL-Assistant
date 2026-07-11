import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)
print("API Key:", os.getenv("GEMINI_API_KEY"))

def generate_insights(question: str, results: list):

    if not results:
        return "No data available for analysis."

    prompt = f"""
You are a data analyst.

User Question:
{question}

SQL Results:
{results}

Provide:
1. Short Summary
2. Important Observations
3. Keep under 100 words.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt
        )

        print("Gemini Response:", response)

        return response.text.strip()

    except Exception as e:
        print("\n========== GEMINI ERROR ==========")
        print(type(e).__name__)
        print(e)
        print("==================================\n")

        return "Unable to generate AI insights."