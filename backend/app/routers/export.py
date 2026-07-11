from io import BytesIO

import pandas as pd
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import engine, get_db
from app.services.history_service import get_latest_query

router = APIRouter(
    prefix="/export",
    tags=["Export"]
)


@router.post("/excel")
def export_excel(db: Session = Depends(get_db)):
    """
    Export the latest query result to Excel.
    """

    latest_query = get_latest_query(db)

    if not latest_query:
        raise HTTPException(
            status_code=404,
            detail="No query history found."
        )

    sql = latest_query.sql_query

    try:
        with engine.connect() as connection:
            result = connection.execute(text(sql))

            df = pd.DataFrame(
                result.fetchall(),
                columns=result.keys()
            )

        output = BytesIO()

        with pd.ExcelWriter(
            output,
            engine="openpyxl"
        ) as writer:
            df.to_excel(
                writer,
                index=False,
                sheet_name="Results"
            )

        output.seek(0)

        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition":
                    "attachment; filename=query_results.xlsx"
            }
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )