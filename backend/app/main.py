from fastapi import FastAPI
from app.routers.upload import router as upload_router
from app.database import Base, engine
import app.models.dataset

app = FastAPI(title="AI SQL Assistant")

Base.metadata.create_all(bind=engine)

app.include_router(upload_router)
@app.get("/")
def root():
    return {"message": "AI SQL Assistant API is running!"}