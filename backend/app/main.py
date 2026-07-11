from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.routers.upload import router as upload_router
from app.routers.chat import router as chat_router
from app.routers.history import router as history_router
from app.routers.export import router as export_router
from app.routers.export_pdf import router as export_pdf_router

import app.models.dataset

app = FastAPI(title="AI SQL Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(history_router)
app.include_router(export_router)
app.include_router(export_pdf_router)

@app.get("/")
def root():
    return {"message": "AI SQL Assistant API is running!"}