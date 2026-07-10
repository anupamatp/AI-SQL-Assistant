from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db, engine
from app.schemas.chat import ChatRequest

from app.services.dataset_service import get_latest_dataset
from app.services.schema_service import get_table_schema
from app.services.ai_service import generate_sql
from app.services.sql_validator import validate_sql
from app.services.query_service import execute_query
router = APIRouter(
    prefix="/chat",
    tags=["AI Chat"]
)


@router.post("/")
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    # Get latest uploaded dataset
    dataset = get_latest_dataset(db)

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="No dataset uploaded."
        )

    # Read table schema
    columns = get_table_schema(
        engine,
        dataset.table_name
    )
    print("Table:", dataset.table_name)
    print("Columns:", columns)
    # Generate SQL using Gemini
    sql = generate_sql(
        question=request.question,
        table_name=dataset.table_name,
        columns=columns
    )
    print("Generated SQL:")
    print(sql)

    # Validate SQL
    valid, error = validate_sql(sql)

    if not valid:
        raise HTTPException(
            status_code=400,
            detail=error
        )

    # Execute SQL
    results = execute_query(
        engine,
        sql
    )

    return {
        "question": request.question,
        "generated_sql": sql,
        "results": results
    }