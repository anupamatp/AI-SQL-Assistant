from io import BytesIO

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Table

from app.database import engine, get_db
from app.services.history_service import get_latest_query
from app.services.query_service import execute_query
from app.services.sql_validator import validate_sql

router = APIRouter(
    prefix="/export",
    tags=["Export"]
)


@router.post("/pdf")
def export_pdf(db: Session = Depends(get_db)):
    """
    Export the latest query result to PDF.
    """

    latest_query = get_latest_query(db)

    if not latest_query:
        raise HTTPException(
            status_code=404,
            detail="No query history found."
        )

    sql = latest_query.sql_query

    valid, error = validate_sql(sql)

    if not valid:
        raise HTTPException(
            status_code=400,
            detail=error
        )

    results = execute_query(engine, sql)

    if not results:
        raise HTTPException(
            status_code=404,
            detail="No data found."
        )

    buffer = BytesIO()

    doc = SimpleDocTemplate(buffer)

    elements = []

    styles = getSampleStyleSheet()

    elements.append(
        Paragraph(
            "AI SQL Assistant Report",
            styles["Heading1"]
        )
    )

    # Show SQL in the PDF
    elements.append(
        Paragraph(
            f"<b>Generated SQL:</b><br/>{sql}",
            styles["BodyText"]
        )
    )

    headers = list(results[0].keys())

    data = [headers]

    for row in results:
        data.append(list(row.values()))

    table = Table(data)

    table.setStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
    ])

    elements.append(table)

    doc.build(elements)

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=query_results.pdf"
        },
    )