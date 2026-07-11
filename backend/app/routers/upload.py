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
from app.services.history_service import clear_history
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
        df.columns = (
            df.columns
            .str.strip()
            .str.replace(" ", "_")
            .str.replace("-", "_")
            .str.lower()
        )
        df = df.replace(r'^\s*$', pd.NA, regex=True)
        print("\n===== Missing Values =====")
        print(df.isna().sum())

        print("\n===== Row 1021 =====")
        print(df.iloc[20])   # 21st row

        print("\n===== City value =====")
        print(repr(df.iloc[20]["city"]))
        print("Missing values:")
        print(df.isna().sum())

        print("\nRows with missing city:")
        print(df[df["city"].isna()])
# Convert order_date to datetime if the column exists
        if "order_date" in df.columns:
            df["order_date"] = pd.to_datetime(
                df["order_date"],
                format="mixed",
                errors="raise"
        )

        print(df.dtypes)
        print(df["order_date"].head())
        print(df.columns.tolist())
        
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
        clear_history(db)
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