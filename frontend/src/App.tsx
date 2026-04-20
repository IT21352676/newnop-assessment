import { useAuthStore } from "./lib/store";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import NotFound from "./components/ui/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TooltipProvider } from "./components/ui/Tooltip";

export default function App() {
  const { token } = useAuthStore();

  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route
            path="/login"
            element={token ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={
              token ? <Navigate to="/dashboard" replace /> : <Register />
            }
          />

          <Route
            path="/dashboard"
            element={token ? <Dashboard /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/"
            element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer
          aria-label="Toast notifications container"
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </TooltipProvider>
    </BrowserRouter>
  );
}
