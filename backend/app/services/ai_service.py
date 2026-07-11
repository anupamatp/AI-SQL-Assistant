import os

from dotenv import load_dotenv
from google import genai
from google.genai.errors import ClientError, ServerError

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)





def generate_sql(question, table_name, columns):
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

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt
        )

        return response.text.strip()

    except ServerError:
        raise Exception(
            "Gemini AI is temporarily unavailable. Please try again."
        )

    except ClientError as e:
        raise Exception(f"Gemini API Error: {e}")

    except Exception as e:
        raise Exception(f"Unexpected AI Error: {e}")