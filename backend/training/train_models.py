"""
MediPredict AI - Machine Learning Training Pipeline
Trains Heart Disease, Diabetes, and Breast Cancer models
and saves the best performing model for each disease.
"""

import os
import sys
import json
import warnings
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, confusion_matrix
)
from xgboost import XGBClassifier

warnings.filterwarnings("ignore")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "datasets", "raw")
MODEL_DIR = os.path.join(BASE_DIR, "saved_models")
os.makedirs(MODEL_DIR, exist_ok=True)


def evaluate_model(model, X_test, y_test, model_name):
    """Compute full metrics for a trained model."""
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1] if hasattr(model, "predict_proba") else y_pred
    return {
        "model": model_name,
        "accuracy": round(accuracy_score(y_test, y_pred), 4),
        "precision": round(precision_score(y_test, y_pred, zero_division=0), 4),
        "recall": round(recall_score(y_test, y_pred, zero_division=0), 4),
        "f1_score": round(f1_score(y_test, y_pred, zero_division=0), 4),
        "roc_auc": round(roc_auc_score(y_test, y_prob), 4),
        "confusion_matrix": confusion_matrix(y_test, y_pred).tolist(),
    }


# ─────────────────────────────────────────────
#  1. HEART DISEASE
# ─────────────────────────────────────────────
def train_heart_disease():
    print("\n=== Training Heart Disease Model ===")
    cols = ["age","sex","cp","trestbps","chol","fbs","restecg",
            "thalach","exang","oldpeak","slope","ca","thal","target"]
    df = pd.read_csv(os.path.join(DATA_DIR, "heart_disease.data"),
                     header=None, names=cols, na_values="?")
    df.dropna(inplace=True)
    df["target"] = (df["target"] > 0).astype(int)

    X = df.drop("target", axis=1)
    y = df["target"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y)

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s  = scaler.transform(X_test)

    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "SVM": SVC(probability=True, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "XGBoost": XGBClassifier(n_estimators=100, eval_metric="logloss",
                                  random_state=42, verbosity=0),
    }

    results = []
    best_score, best_model, best_name = 0, None, ""
    for name, mdl in models.items():
        mdl.fit(X_train_s, y_train)
        r = evaluate_model(mdl, X_test_s, y_test, name)
        results.append(r)
        print(f"  {name}: acc={r['accuracy']} auc={r['roc_auc']}")
        if r["roc_auc"] > best_score:
            best_score, best_model, best_name = r["roc_auc"], mdl, name

    print(f"  ✓ Best: {best_name} (AUC={best_score})")
    joblib.dump({"model": best_model, "scaler": scaler, "features": list(X.columns),
                 "best_model_name": best_name},
                os.path.join(MODEL_DIR, "heart_model.pkl"))
    return results


# ─────────────────────────────────────────────
#  2. DIABETES  (Pima Indians — stored as diabetes.csv)
# ─────────────────────────────────────────────
def train_diabetes():
    print("\n=== Training Diabetes Model ===")
    df = pd.read_csv(os.path.join(DATA_DIR, "diabetes.csv"))

    # Zero-values in certain columns are medically impossible → treat as NaN
    zero_cols = ["Glucose","BloodPressure","SkinThickness","Insulin","BMI"]
    df[zero_cols] = df[zero_cols].replace(0, np.nan)
    df.fillna(df.median(numeric_only=True), inplace=True)

    X = df.drop("Outcome", axis=1)
    y = df["Outcome"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y)

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s  = scaler.transform(X_test)

    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "XGBoost": XGBClassifier(n_estimators=100, eval_metric="logloss",
                                  random_state=42, verbosity=0),
    }

    results = []
    best_score, best_model, best_name = 0, None, ""
    for name, mdl in models.items():
        mdl.fit(X_train_s, y_train)
        r = evaluate_model(mdl, X_test_s, y_test, name)
        results.append(r)
        print(f"  {name}: acc={r['accuracy']} auc={r['roc_auc']}")
        if r["roc_auc"] > best_score:
            best_score, best_model, best_name = r["roc_auc"], mdl, name

    print(f"  ✓ Best: {best_name} (AUC={best_score})")
    joblib.dump({"model": best_model, "scaler": scaler, "features": list(X.columns),
                 "best_model_name": best_name},
                os.path.join(MODEL_DIR, "diabetes_model.pkl"))
    return results


# ─────────────────────────────────────────────
#  3. BREAST CANCER  (Wisconsin — stored as breast_cancer.csv)
# ─────────────────────────────────────────────
def train_breast_cancer():
    print("\n=== Training Breast Cancer Model ===")
    df = pd.read_csv(os.path.join(DATA_DIR, "breast_cancer.csv"))
    df.drop(columns=["id"], errors="ignore", inplace=True)
    # Drop any trailing unnamed columns
    df = df.loc[:, ~df.columns.str.startswith("Unnamed")]
    df.dropna(inplace=True)

    df["target"] = (df["diagnosis"] == "M").astype(int)
    df.drop(columns=["diagnosis"], inplace=True)

    X = df.drop("target", axis=1)
    y = df["target"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y)

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s  = scaler.transform(X_test)

    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "SVM": SVC(probability=True, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "XGBoost": XGBClassifier(n_estimators=100, eval_metric="logloss",
                                  random_state=42, verbosity=0),
    }

    results = []
    best_score, best_model, best_name = 0, None, ""
    for name, mdl in models.items():
        mdl.fit(X_train_s, y_train)
        r = evaluate_model(mdl, X_test_s, y_test, name)
        results.append(r)
        print(f"  {name}: acc={r['accuracy']} auc={r['roc_auc']}")
        if r["roc_auc"] > best_score:
            best_score, best_model, best_name = r["roc_auc"], mdl, name

    print(f"  ✓ Best: {best_name} (AUC={best_score})")
    joblib.dump({"model": best_model, "scaler": scaler, "features": list(X.columns),
                 "best_model_name": best_name},
                os.path.join(MODEL_DIR, "breast_model.pkl"))
    return results


if __name__ == "__main__":
    all_metrics = {
        "heart": train_heart_disease(),
        "diabetes": train_diabetes(),
        "breast_cancer": train_breast_cancer(),
    }
    metrics_path = os.path.join(MODEL_DIR, "metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(all_metrics, f, indent=2)
    print(f"\n✅ All models trained. Metrics saved to {metrics_path}")
