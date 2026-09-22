const ML_API_URL = "http://127.0.0.1:8000";

export async function predictTriage(patientData) {
  const response = await fetch(`${ML_API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patientData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "ML prediction failed."
    );
  }

  return data;
}