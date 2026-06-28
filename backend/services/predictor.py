"""Prediction service with feature importance for all models."""
import os, json
import numpy as np, joblib
from typing import Tuple, List, Dict

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "saved_models")
_cache: dict = {}

# Human-readable labels
HEART_LABELS = {
    "age":"Age","sex":"Sex","cp":"Chest Pain Type","trestbps":"Blood Pressure",
    "chol":"Cholesterol","fbs":"Fasting Blood Sugar","restecg":"Resting ECG",
    "thalach":"Max Heart Rate","exang":"Exercise Angina","oldpeak":"ST Depression",
    "slope":"ST Slope","ca":"Major Vessels","thal":"Thalassemia"
}
DIABETES_LABELS = {
    "Pregnancies":"Pregnancies","Glucose":"Glucose Level","BloodPressure":"Blood Pressure",
    "SkinThickness":"Skin Thickness","Insulin":"Insulin Level","BMI":"BMI",
    "DiabetesPedigreeFunction":"Diabetes Pedigree","Age":"Age"
}
BREAST_LABELS = {
    "radius_mean":"Radius","texture_mean":"Texture","perimeter_mean":"Perimeter",
    "area_mean":"Area","smoothness_mean":"Smoothness","compactness_mean":"Compactness",
    "concavity_mean":"Concavity","concave points_mean":"Concave Points",
    "symmetry_mean":"Symmetry","fractal_dimension_mean":"Fractal Dim",
    "radius_se":"Radius SE","texture_se":"Texture SE","perimeter_se":"Perimeter SE",
    "area_se":"Area SE","radius_worst":"Radius Worst","texture_worst":"Texture Worst",
    "perimeter_worst":"Perimeter Worst","area_worst":"Area Worst",
    "concavity_worst":"Concavity Worst","concave points_worst":"Concave Pts Worst",
}

def _load(name: str) -> dict:
    if name not in _cache:
        path = os.path.join(MODEL_DIR, f"{name}.pkl")
        _cache[name] = joblib.load(path)
    return _cache[name]

def _risk(prob: float) -> str:
    if prob < 0.30: return "Low"
    if prob < 0.60: return "Medium"
    return "High"

def _feature_importance(model, features: List[str], label_map: Dict, top_n=5) -> List[Dict]:
    try:
        if hasattr(model, "feature_importances_"):
            imp = model.feature_importances_
        elif hasattr(model, "coef_"):
            imp = np.abs(model.coef_[0])
        else:
            return []
        total = imp.sum()
        if total == 0: return []
        pct = (imp / total * 100)
        pairs = sorted(zip(features, pct), key=lambda x: -x[1])[:top_n]
        return [{"feature": label_map.get(f, f.replace("_"," ").title()), "importance": round(float(v), 1)} for f, v in pairs]
    except Exception as e:
        return []

def predict_heart(data: dict):
    b = _load("heart_model")
    X = np.array([[data[f] for f in b["features"]]])
    Xs = b["scaler"].transform(X)
    prob = float(b["model"].predict_proba(Xs)[0][1])
    fi = _feature_importance(b["model"], b["features"], HEART_LABELS)
    return ("Positive" if prob>=0.5 else "Negative"), round(prob,4), _risk(prob), b["best_model_name"], fi

def predict_diabetes(data: dict):
    b = _load("diabetes_model")
    X = np.array([[data[f] for f in b["features"]]])
    Xs = b["scaler"].transform(X)
    prob = float(b["model"].predict_proba(Xs)[0][1])
    fi = _feature_importance(b["model"], b["features"], DIABETES_LABELS)
    return ("Positive" if prob>=0.5 else "Negative"), round(prob,4), _risk(prob), b["best_model_name"], fi

def predict_breast(data: dict):
    b = _load("breast_model")
    key_map = {"concave_points_mean":"concave points_mean","concave_points_se":"concave points_se","concave_points_worst":"concave points_worst"}
    mapped = {key_map.get(k,k): v for k,v in data.items()}
    X = np.array([[mapped[f] for f in b["features"]]])
    Xs = b["scaler"].transform(X)
    prob = float(b["model"].predict_proba(Xs)[0][1])
    fi = _feature_importance(b["model"], b["features"], BREAST_LABELS)
    return ("Malignant" if prob>=0.5 else "Benign"), round(prob,4), _risk(prob), b["best_model_name"], fi

def get_metrics() -> dict:
    path = os.path.join(MODEL_DIR, "metrics.json")
    if not os.path.exists(path): return {"heart":[],"diabetes":[],"breast_cancer":[]}
    with open(path) as f: return json.load(f)

def get_stats(db) -> dict:
    from database.database import Prediction
    total = db.query(Prediction).count()
    heart = db.query(Prediction).filter(Prediction.disease_type=="heart").count()
    diab  = db.query(Prediction).filter(Prediction.disease_type=="diabetes").count()
    breast= db.query(Prediction).filter(Prediction.disease_type=="breast_cancer").count()
    pos   = db.query(Prediction).filter(Prediction.prediction.in_(["Positive","Malignant"])).count()
    return {"total":total,"heart":heart,"diabetes":diab,"breast_cancer":breast,"positive":pos}
