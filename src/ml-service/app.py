from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib
import xgboost as xgb

app = FastAPI(title="SwasthyaSetu ML Service")
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

# Load model and preprocessing pipeline once when the service starts
model = xgb.XGBClassifier()
model.load_model("xgboost_triage_model.json")

preprocessor = joblib.load("preprocessor.joblib")


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
        # Convert request into the same structure
        # used during model training.
        patient_data = pd.DataFrame([patient.model_dump()])

        # Apply the original preprocessing pipeline.
        patient_encoded = preprocessor.transform(patient_data)

        # Model prediction.
        prediction = model.predict(patient_encoded)

        # Model classes are 0-4.
        # Convert them to triage levels 1-5.
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