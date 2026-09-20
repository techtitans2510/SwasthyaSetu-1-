import dashboardMock from "../mocks/dashboard.mock";

const USE_MOCK_DATA = true;

export async function getDashboard() {
  if (USE_MOCK_DATA) {
    return Promise.resolve(dashboardMock);
  }

  const response = await fetch("/api/patient/dashboard");

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
}