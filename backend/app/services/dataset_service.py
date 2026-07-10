from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.dataset import Dataset


def save_dataset(
    db: Session,
    dataset_name: str,
    table_name: str
):
    """
    Save uploaded dataset information.
    """

    dataset = Dataset(
        dataset_name=dataset_name,
        table_name=table_name
    )

    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    return dataset


def get_latest_dataset(db: Session):
    """
    Return the most recently uploaded dataset.
    """

    return (
        db.query(Dataset)
        .order_by(desc(Dataset.uploaded_at))
        .first()
    )