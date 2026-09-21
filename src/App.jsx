import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MedicalRecords from "./pages/MedicalRecords";
import MedicalRecordDetails from "./pages/MedicalRecordDetails";
import Facilities from "./pages/Facilities";
import FacilityDetails from "./pages/FacilityDetails";
import Appointments from "./pages/Appointments";
import WorkerLayout from "./layouts/WorkerLayout";
import WorkerDashboard from "./pages/WorkerDashboard";

import PatientLayout from "./layouts/PatientLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function Unauthorized() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================================
            PUBLIC ROUTES
        ================================= */}

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ================================
            PROTECTED PATIENT ROUTES
        ================================= */}

        <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
          <Route element={<PatientLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/medical-records" element={<MedicalRecords />} />

            <Route
              path="/medical-records/:id"
              element={<MedicalRecordDetails />}
            />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/facilities/:id" element={<FacilityDetails />} />
            <Route path="/appointments" element={<Appointments />} />
          </Route>
        </Route>
        <Route
          element={<ProtectedRoute allowedRoles={["asha", "nurse", "anm"]} />}
        >
          <Route element={<WorkerLayout />}>
            <Route path="/worker/dashboard" element={<WorkerDashboard />} />
          </Route>
        </Route>

        {/* ================================
            UNAUTHORIZED
        ================================= */}

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
