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

    return {
        "message": "File uploaded successfully",
        "filename": file.filename
    }