from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.chat import ChatRequest
from app.services.dataset_service import get_latest_dataset

from app.database import engine
from app.services.schema_service import get_table_schema

router = APIRouter(
    prefix="/chat",
    tags=["AI Chat"]
)


@router.post("/")
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):

    dataset = get_latest_dataset(db)
    columns = get_table_schema(
    engine,
    dataset.table_name
    )

    return {
        "question": request.question,
        "table": dataset.table_name,
        "columns": columns
    }