import { Outlet } from "react-router-dom";
import WorkerSidebar from "../components/WorkerSidebar";

function WorkerLayout() {
  return (
    <div className="worker-app-container">
      <WorkerSidebar />
      <main className="worker-main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default WorkerLayout;
