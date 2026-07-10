import time
from io import BytesIO

import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.database import engine
from app.services.table_service import (
    create_dynamic_table,
    insert_dataframe
)
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.dataset_service import save_dataset

router = APIRouter(
    prefix="/upload",
    tags=["Dataset Upload"]
)


@router.post("/")
async def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload a CSV or Excel dataset.
    """

    allowed_extensions = (".csv", ".xlsx", ".xls")

    if not file.filename.lower().endswith(allowed_extensions):
        raise HTTPException(
            status_code=400,
            detail="Only CSV and Excel files are allowed."
        )

    # Read the uploaded file
    try:
        contents = await file.read()

        if file.filename.lower().endswith(".csv"):
            df = pd.read_csv(BytesIO(contents))
        else:
            df = pd.read_excel(BytesIO(contents))

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Unable to read file: {str(e)}"
        )

    # Generate a unique table name
    table_name = (
        file.filename
        .split(".")[0]
        .replace(" ", "_")
        .lower()
    )

    table_name = f"{table_name}_{int(time.time())}"

    # Create the PostgreSQL table dynamically
    try:
        table = create_dynamic_table(
            table_name=table_name,
            dataframe=df,
            engine=engine
        )
        insert_dataframe(
            table=table,
            dataframe=df,
            engine=engine
        )
        save_dataset(
            db=db,
            dataset_name=file.filename,
            table_name=table_name
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create table: {str(e)}"
        )

    return {
        "message": "Dataset uploaded successfully",
        "filename": file.filename,
        "table_name": table_name,
        "rows": len(df),
        "columns": list(df.columns),
        "preview": df.head(5).to_dict(orient="records")
    }