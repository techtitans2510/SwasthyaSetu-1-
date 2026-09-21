import { getMockWorkerPatients } from "../mocks/workerPatients.mock";

/*
 * Worker Patients API
 *
 * Currently:
 *   Mock data
 *
 * Later:
 *   GET /api/worker/patients
 *
 * The UI should use this function instead of
 * directly importing mock data.
 */

export async function getWorkerPatients() {
  await new Promise((resolve) => {
    setTimeout(resolve, 300);
  });

  return getMockWorkerPatients();
}