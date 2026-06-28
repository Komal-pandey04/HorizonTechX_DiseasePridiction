"""MediPredict AI — FastAPI v2.0  |  uvicorn main:app --reload"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database.database import init_db
from routes.api import router

app = FastAPI(
    title="MediPredict AI API",
    description="Multi-disease prediction with ML — Heart Disease, Diabetes, Breast Cancer",
    version="2.0.0",
    docs_url="/docs", redoc_url="/redoc",
)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"], allow_credentials=True)

@app.on_event("startup")
def startup(): init_db()

app.include_router(router)

@app.get("/")
def root(): return {"message": "MediPredict AI v2.0 running", "docs": "/docs"}
