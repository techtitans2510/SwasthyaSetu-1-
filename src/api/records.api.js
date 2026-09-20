import recordsMock from "../mocks/records.mock";

const USE_MOCK_DATA = true;

export async function getMedicalRecords() {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => {
      setTimeout(resolve, 400);
    });

    return recordsMock;
  }

  const response = await fetch(
    "/api/patient/medical-records"
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch medical records"
    );
  }

  return response.json();
}

export async function getMedicalRecordById(id) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => {
      setTimeout(resolve, 300);
    });

    const record = recordsMock.find(
      (item) => item.id === id
    );

    if (!record) {
      throw new Error("Medical record not found");
    }

    return record;
  }

  const response = await fetch(
    `/api/patient/medical-records/${id}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch medical record"
    );
  }

  return response.json();
}