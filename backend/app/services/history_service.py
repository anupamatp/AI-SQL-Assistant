from sqlalchemy.orm import Session

from app.models.query_history import QueryHistory


def save_history(db: Session, question: str, sql: str):
    history = QueryHistory(
        question=question,
        sql_query=sql
    )

    db.add(history)
    db.commit()
    db.refresh(history)

    return history


def get_history(db: Session):
    return (
        db.query(QueryHistory)
        .order_by(QueryHistory.created_at.desc())
        .all()
    )
def get_latest_query(db: Session):
    return (
        db.query(QueryHistory)
        .order_by(QueryHistory.created_at.desc())
        .first()
    )
def clear_history(db: Session):
    db.query(QueryHistory).delete()
    db.commit()