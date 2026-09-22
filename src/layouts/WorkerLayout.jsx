import { Outlet } from "react-router-dom";
import WorkerSidebar from "../components/WorkerSidebar";
import AiAssistant from "../components/AiAssistant/AiAssistant";

function WorkerLayout() {
  return (
    <div className="worker-app-container">
      <WorkerSidebar />

      <main className="worker-main-content">
        <Outlet />
      </main>

      {/* AI Navigation Assistant */}
      <AiAssistant />
    </div>
  );
}

export default WorkerLayout;