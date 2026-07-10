from fastapi import FastAPI
from app.routers.upload import router as upload_router

app = FastAPI(title="AI SQL Assistant")


app.include_router(upload_router)
@app.get("/")
def root():
    return {"message": "AI SQL Assistant API is running!"}