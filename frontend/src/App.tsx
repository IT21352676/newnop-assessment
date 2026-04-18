import { useAuthStore } from "@/src/lib/store";
import { useEffect, useState } from "react";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

export default function App() {
  const { token } = useAuthStore();
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (!token) {
    return hash === "#register" ? <Register /> : <Login />;
  }

  return <>hello</>;
}
