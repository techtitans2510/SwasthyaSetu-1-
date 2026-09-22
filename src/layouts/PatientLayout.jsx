import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AiAssistant from "../components/AiAssistant/AiAssistant";

function PatientLayout() {
  return (
    <div className="patient-app-container">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Layout Area */}
      <div className="patient-content-wrapper">
        <Header />

        <main className="patient-main-content">
          <Outlet />
        </main>
      </div>

      {/* AI Navigation Assistant */}
      <AiAssistant />
    </div>
  );
}

export default PatientLayout;