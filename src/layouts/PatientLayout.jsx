import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function PatientLayout() {
  return (
    <div className="patient-layout">

      <Header />

      <main className="patient-main">
        <Outlet />
      </main>

    </div>
  );
}

export default PatientLayout;