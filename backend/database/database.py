from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'medipredict.db')
engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Prediction(Base):
    __tablename__ = "predictions"
    id               = Column(Integer, primary_key=True, index=True)
    patient_name     = Column(String, nullable=False)
    disease_type     = Column(String, nullable=False)
    prediction       = Column(String, nullable=False)
    probability      = Column(Float,  nullable=False)
    risk_level       = Column(String, nullable=False)
    model_used       = Column(String, nullable=True)
    prediction_date  = Column(DateTime, default=datetime.utcnow)
    feature_importance = Column(JSON, nullable=True, default=list)

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
