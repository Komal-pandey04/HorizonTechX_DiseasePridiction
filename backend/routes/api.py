from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.database import get_db, Prediction
from schemas.schemas import HeartInput, DiabetesInput, BreastInput, PredictionResponse
from services.predictor import predict_heart, predict_diabetes, predict_breast, get_metrics, get_stats

router = APIRouter()

def _save(db, name, dtype, pred, prob, risk, model, fi):
    rec = Prediction(
        patient_name=name, disease_type=dtype, prediction=pred,
        probability=prob, risk_level=risk, model_used=model,
        prediction_date=datetime.utcnow(),
        feature_importance=[{"feature":x["feature"],"importance":x["importance"]} for x in fi]
    )
    db.add(rec); db.commit(); db.refresh(rec)
    return rec

@router.post("/predict/heart", response_model=PredictionResponse)
def predict_heart_api(body: HeartInput, db: Session = Depends(get_db)):
    data = body.model_dump(); name = data.pop("patient_name")
    label, prob, risk, model, fi = predict_heart(data)
    rec = _save(db, name, "heart", label, prob, risk, model, fi)
    rec.feature_importance = [type('FI', (), {'feature':x['feature'],'importance':x['importance']})() for x in fi]
    return rec

@router.post("/predict/diabetes", response_model=PredictionResponse)
def predict_diabetes_api(body: DiabetesInput, db: Session = Depends(get_db)):
    data = body.model_dump(); name = data.pop("patient_name")
    label, prob, risk, model, fi = predict_diabetes(data)
    rec = _save(db, name, "diabetes", label, prob, risk, model, fi)
    rec.feature_importance = [type('FI', (), {'feature':x['feature'],'importance':x['importance']})() for x in fi]
    return rec

@router.post("/predict/breast", response_model=PredictionResponse)
def predict_breast_api(body: BreastInput, db: Session = Depends(get_db)):
    data = body.model_dump(); name = data.pop("patient_name")
    label, prob, risk, model, fi = predict_breast(data)
    rec = _save(db, name, "breast_cancer", label, prob, risk, model, fi)
    rec.feature_importance = [type('FI', (), {'feature':x['feature'],'importance':x['importance']})() for x in fi]
    return rec

@router.get("/history", response_model=list[PredictionResponse])
def get_history(db: Session = Depends(get_db)):
    recs = db.query(Prediction).order_by(Prediction.prediction_date.desc()).all()
    for r in recs:
        fi = r.feature_importance or []
        r.feature_importance = [type('FI',(),{'feature':x['feature'],'importance':x['importance']})() for x in fi]
    return recs

@router.delete("/history/{rid}")
def delete_history(rid: int, db: Session = Depends(get_db)):
    r = db.query(Prediction).filter(Prediction.id == rid).first()
    if not r: raise HTTPException(404, "Not found")
    db.delete(r); db.commit()
    return {"ok": True}

@router.get("/metrics")
def metrics_api(): return get_metrics()

@router.get("/stats")
def stats_api(db: Session = Depends(get_db)): return get_stats(db)

@router.get("/health")
def health(): return {"status": "ok", "version": "2.0.0"}
