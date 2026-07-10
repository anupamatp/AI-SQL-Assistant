import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_sql(question, table_name, columns):
    """
    Generate PostgreSQL SQL from a natural language question.
    """

    prompt = f"""
You are an expert PostgreSQL SQL generator.

Rules:
- Return ONLY SQL.
- Do not explain anything.
- Do not wrap the SQL in ```sql.
- Use PostgreSQL syntax.
- Use ONLY the table and columns provided.
- Do not invent column names.

Table:
{table_name}

Columns:
{", ".join(columns)}

Question:
{question}
"""

    response = client.models.generate_content(
    model="gemini-3.1-flash-lite",
    contents=prompt
)

    return response.text.strip()