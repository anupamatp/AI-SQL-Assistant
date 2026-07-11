from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.database import Base


class QueryHistory(Base):
    __tablename__ = "query_history"

    id = Column(Integer, primary_key=True, index=True)

    question = Column(String, nullable=False)

    sql_query = Column(String, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())