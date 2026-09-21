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
import WorkerPatients from "./pages/WorkerPatients";
import WorkerPatientProfile from "./pages/WorkerPatientProfile";
import WorkerNewVisit from "./pages/WorkerNewVisit";
import WorkerVisits from "./pages/WorkerVisits";
import WorkerReferrals from "./pages/WorkerReferrals";
import WorkerNewReferral from "./pages/WorkerNewReferral";
import WorkerReferralDetails from "./pages/WorkerReferralDetails";
import WorkerFollowUps from "./pages/WorkerFollowUps";

import PatientLayout from "./layouts/PatientLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import useLanguage from "./hooks/useLanguage";

function Unauthorized() {
  const { t } = useLanguage();
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{t("auth.accessDenied", "Access Denied")}</h1>
        <p>{t("auth.noPermission", "You don't have permission to access this page.")}</p>
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

        {/* ================================
            PROTECTED WORKER (ASHA/ANM/NURSE) ROUTES
        ================================= */}

        <Route
          element={<ProtectedRoute allowedRoles={["asha", "nurse", "anm"]} />}
        >
          <Route element={<WorkerLayout />}>
            <Route path="/worker/dashboard" element={<WorkerDashboard />} />
            <Route path="/worker/patients" element={<WorkerPatients />} />
            <Route path="/worker/patients/:id" element={<WorkerPatientProfile />} />
            <Route path="/worker/visits" element={<WorkerVisits />} />
            <Route path="/worker/visits/new" element={<WorkerNewVisit />} />
            <Route path="/worker/referrals" element={<WorkerReferrals />} />
            <Route path="/worker/referrals/new" element={<WorkerNewReferral />} />
            <Route path="/worker/referrals/:id" element={<WorkerReferralDetails />} />
            <Route path="/worker/follow-ups" element={<WorkerFollowUps />} />
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
