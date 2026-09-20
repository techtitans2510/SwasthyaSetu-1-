import facilitiesMock from "../mocks/facilities.mock";

const USE_MOCK_DATA = true;

export async function getFacilities() {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => {
      setTimeout(resolve, 400);
    });

    return facilitiesMock;
  }

  const response = await fetch(
    "/api/patient/facilities"
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch healthcare facilities"
    );
  }

  return response.json();
}

export async function getFacilityById(id) {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => {
      setTimeout(resolve, 300);
    });

    const facility = facilitiesMock.find(
      (item) => item.id === id
    );

    if (!facility) {
      throw new Error(
        "Healthcare facility not found"
      );
    }

    return facility;
  }

  const response = await fetch(
    `/api/patient/facilities/${id}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch healthcare facility"
    );
  }

  return response.json();
}