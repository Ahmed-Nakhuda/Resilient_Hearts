import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://resilient-hearts-api-hceyatazggfahhcp.canadacentral-01.azurewebsites.net/check-session", { withCredentials: true })
      .then(response => {
        setRole(response.data.role);
      })
      .catch(() => {
        setRole(null); // Not logged in
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>; // Prevent flashing

  return allowedRoles.includes(role) ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
