import { useState } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Manages form data state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:3001/login", formData, { withCredentials: true });

      setSuccess(response.data.message);

      // Redirect based on the role
      axios.get("http://localhost:3001/check-session", { withCredentials: true }) 
        .then((res) => {
          if (res.data.role === "admin") {
            navigate("/admin-dashboard");
          } else if(res.data.role === "user") {
            navigate("/home");
          } else if(res.data.role === "facilitator") {
            navigate("/facilitator-dashboard");
          }
        })
        .catch(() => {
          setError("Session verification failed.");
        });

    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };


  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 400, margin: "auto", mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="success.main">{success}</Typography>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          name="email"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.password}
          onChange={handleChange}
        />
        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>

      <Box mt={2} textAlign="center">
        <Typography variant="body2">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Typography>
      </Box>
    </Paper>
  );
};

export default Login;
