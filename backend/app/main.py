# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.routes.recommendations import router as recommendations_router

app = FastAPI(
    title="AI Agent Reliability & QA Platform MVP",
    version="0.1.0",
)

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

app.include_router(recommendations_router, prefix="/api/v1")


@app.get("/health")
def health_check():
    return {"status": "ok"}