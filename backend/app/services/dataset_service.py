from sqlalchemy.orm import Session

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