from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class FeatureItem(BaseModel):
    feature: str
    importance: float

class HeartInput(BaseModel):
    patient_name: str
    age: float = Field(..., ge=1, le=120, description="Age in years")
    sex: float = Field(..., ge=0, le=1, description="0=Female, 1=Male")
    cp: float = Field(..., ge=0, le=3, description="Chest pain type 0-3")
    trestbps: float = Field(..., ge=80, le=200, description="Resting BP mmHg")
    chol: float = Field(..., ge=100, le=600, description="Cholesterol mg/dl")
    fbs: float = Field(..., ge=0, le=1, description="Fasting blood sugar >120")
    restecg: float = Field(..., ge=0, le=2, description="Resting ECG 0-2")
    thalach: float = Field(..., ge=50, le=220, description="Max heart rate")
    exang: float = Field(..., ge=0, le=1, description="Exercise induced angina")
    oldpeak: float = Field(..., ge=0, le=10, description="ST depression")
    slope: float = Field(..., ge=0, le=2, description="ST slope 0-2")
    ca: float = Field(..., ge=0, le=4, description="Major vessels 0-4")
    thal: float = Field(..., ge=0, le=7, description="Thalassemia type")

class DiabetesInput(BaseModel):
    patient_name: str
    Pregnancies: float = Field(..., ge=0, le=20)
    Glucose: float = Field(..., ge=0, le=300)
    BloodPressure: float = Field(..., ge=0, le=150)
    SkinThickness: float = Field(..., ge=0, le=100)
    Insulin: float = Field(..., ge=0, le=900)
    BMI: float = Field(..., ge=0, le=70)
    DiabetesPedigreeFunction: float = Field(..., ge=0, le=3)
    Age: float = Field(..., ge=1, le=120)

class BreastInput(BaseModel):
    patient_name: str
    radius_mean: float = Field(..., example=14.0)
    texture_mean: float = Field(..., example=19.0)
    perimeter_mean: float = Field(..., example=92.0)
    area_mean: float = Field(..., example=600.0)
    smoothness_mean: float = Field(..., example=0.10)
    compactness_mean: float = Field(..., example=0.12)
    concavity_mean: float = Field(..., example=0.10)
    concave_points_mean: float = Field(..., example=0.06)
    symmetry_mean: float = Field(..., example=0.18)
    fractal_dimension_mean: float = Field(..., example=0.062)
    radius_se: float = Field(0.405); texture_se: float = Field(1.220)
    perimeter_se: float = Field(2.866); area_se: float = Field(40.34)
    smoothness_se: float = Field(0.006); compactness_se: float = Field(0.020)
    concavity_se: float = Field(0.026); concave_points_se: float = Field(0.010)
    symmetry_se: float = Field(0.018); fractal_dimension_se: float = Field(0.004)
    radius_worst: float = Field(16.27); texture_worst: float = Field(25.68)
    perimeter_worst: float = Field(107.3); area_worst: float = Field(880.6)
    smoothness_worst: float = Field(0.132); compactness_worst: float = Field(0.254)
    concavity_worst: float = Field(0.272); concave_points_worst: float = Field(0.115)
    symmetry_worst: float = Field(0.290); fractal_dimension_worst: float = Field(0.084)

class PredictionResponse(BaseModel):
    id: int
    patient_name: str
    disease_type: str
    prediction: str
    probability: float
    risk_level: str
    model_used: Optional[str]
    prediction_date: datetime
    feature_importance: Optional[List[FeatureItem]] = []
    class Config:
        from_attributes = True
