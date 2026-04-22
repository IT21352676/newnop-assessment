import Hero from "./Hero";
import Kanban from "./Kanban";
import Topbar from "./Topbar";

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-deep p-4 sm:p-6">
      <Topbar />
      <div className="glass-panel p-6 sm:p-12 rounded-2xl text-center">
        <Hero />
        <Kanban />
      </div>
    </div>
  );
};

export default Dashboard;
