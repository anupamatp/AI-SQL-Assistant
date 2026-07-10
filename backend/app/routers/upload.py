import pandas as pd
from io import BytesIO
from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter(
    prefix="/upload",
    tags=["Dataset Upload"]
)


@router.post("/")
async def upload_dataset(file: UploadFile = File(...)):
    """
    Upload a CSV or Excel dataset.
    """

    allowed_extensions = (".csv", ".xlsx", ".xls")

    if not file.filename.endswith(allowed_extensions):
        raise HTTPException(
            status_code=400,
            detail="Only CSV and Excel files are allowed."
        )

    try:
        contents = await file.read()

        if file.filename.endswith(".csv"):
            df = pd.read_csv(BytesIO(contents))
        else:
            df = pd.read_excel(BytesIO(contents))

    except Exception as e:
        raise HTTPException(
        status_code=400,
        detail=f"Unable to read file: {str(e)}"
        )
    return {
    "filename": file.filename,
    "rows": len(df),
    "columns": list(df.columns),
    "preview": df.head(5).to_dict(orient="records")
    }