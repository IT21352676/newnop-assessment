import Hero from "./Hero";
import Kanban from "./Kanban";
import Topbar from "./Topbar";

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-deep p-6">
      <Topbar />
      <div className="glass-panel p-12 rounded-3xl text-center">
        <Hero />
        <Kanban />
      </div>
    </div>
  );
};

export default Dashboard;
