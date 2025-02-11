import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/check-session", { withCredentials: true })
      .then((response) => {
        if (response.data.role !== "admin") {
          navigate("/login"); // Redirect non-admins to login
        } else {
          setRole("admin"); // Set role to admin
        }
      })
      .catch(() => {
        navigate("/login"); // Redirect if session check fails
      });
  }, [navigate]);

  if (role !== "admin") {
    return <div>Loading...</div>; // Prevents flashing
  }

  return (
    <>
      <h1>Admin Dashboard</h1>
      <Link to="/upload-course">Upload Course</Link>
      <br />
      <Link to="upload-course-content">Upload Course Content</Link>
    </>
  );
};

export default AdminDashboard;
