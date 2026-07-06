import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Tenants from "./pages/Tenants";
import Leases from "./pages/Leases";
import Payments from "./pages/Payments";
import Maintenance from "./pages/Maintenance";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/tenants" element={<Tenants />} />
      <Route path="/leases" element={<Leases />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/maintenance" element={<Maintenance />} />
    </Routes>
  );
}
