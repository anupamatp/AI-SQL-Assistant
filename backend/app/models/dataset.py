from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    dataset_name = Column(String, nullable=False)
    table_name = Column(String, nullable=False, unique=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())