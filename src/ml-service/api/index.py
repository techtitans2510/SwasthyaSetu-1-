from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pandas as pd
import joblib
import xgboost as xgb


# ============================================================
# Paths
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "xgboost_triage_model.json"
PREPROCESSOR_PATH = BASE_DIR / "preprocessor.joblib"


# ============================================================
# FastAPI application
# ============================================================

app = FastAPI(
    title="SwasthyaSetu ML Service",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://swasthya-setu-1.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Load ML model and preprocessor
# ============================================================

model = xgb.XGBClassifier()
model.load_model(str(MODEL_PATH))

preprocessor = joblib.load(PREPROCESSOR_PATH)


# ============================================================
# Request schema
# ============================================================

class PatientAssessment(BaseModel):
    age: float
    sex: str
    arrival_mode: str
    mental_status_triage: str
    chief_complaint_system: str

    num_prior_ed_visits_12m: float
    num_prior_admissions_12m: float
    num_active_medications: float
    num_comorbidities: float

    systolic_bp: float
    diastolic_bp: float
    heart_rate: float
    respiratory_rate: float
    temperature_c: float
    spo2: float
    gcs_total: float
    pain_score: float


# ============================================================
# Routes
# ============================================================

@app.get("/")
def root():
    return {
        "service": "SwasthyaSetu ML Service",
        "status": "running",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "xgboost_triage_model",
    }


@app.post("/predict")
def predict_triage(patient: PatientAssessment):
    try:
        # Convert request into DataFrame
        patient_data = pd.DataFrame([patient.model_dump()])

        # Apply the same preprocessing used during training
        patient_encoded = preprocessor.transform(patient_data)

        # Generate prediction
        prediction = model.predict(patient_encoded)

        # Model classes are 0–4 internally,
        # while triage acuity is 1–5.
        triage_level = int(prediction[0]) + 1

        return {
            "success": True,
            "triage_acuity": triage_level,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(error)}",
        )