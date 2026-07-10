from fastapi import FastAPI

app = FastAPI(title="AI SQL Assistant")

@app.get("/")
def root():
    return {"message": "AI SQL Assistant API is running!"}