import pandas as pd
import joblib
import xgboost as xgb

# Load trained model
model = xgb.XGBClassifier()
model.load_model("xgboost_triage_model.json")

# Load preprocessing pipeline
preprocessor = joblib.load("preprocessor.joblib")

# One test patient
patient = pd.DataFrame([{
    "age": 25,
    "sex": "M",
    "arrival_mode": "walk-in",
    "mental_status_triage": "drowsy",
    "chief_complaint_system": "neurological",
    "num_prior_ed_visits_12m": 5,
    "num_prior_admissions_12m": 3,
    "num_active_medications": 10,
    "num_comorbidities": 8,
    "systolic_bp": 70.0,
    "diastolic_bp": 40.0,
    "heart_rate": 140.0,
    "respiratory_rate": 35.0,
    "temperature_c": 40.0,
    "spo2": 75.0,
    "gcs_total": 8,
    "pain_score": 10
}])
# Same preprocessing used during training
patient_encoded = preprocessor.transform(patient)

# Prediction
prediction = model.predict(patient_encoded)

# Model classes are 0-4, convert back to 1-5
triage_level = int(prediction[0]) + 1

print("Predicted Triage Acuity:", triage_level)