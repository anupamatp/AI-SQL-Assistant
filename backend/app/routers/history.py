from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.history_service import get_history
from app.services.history_service import (
    get_history,
    clear_history
)

router = APIRouter(
    prefix="/history",
    tags=["Query History"]
)


@router.get("/")
def history(db: Session = Depends(get_db)):
    return get_history(db)

@router.delete("/")
def delete_history(db: Session = Depends(get_db)):
    clear_history(db)

    return {
        "message": "History cleared successfully"
    }