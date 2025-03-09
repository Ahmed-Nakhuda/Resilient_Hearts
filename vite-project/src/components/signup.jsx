import React, { useState } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {

  //  Defines and manages the state of the form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    specialNeeds: "",
    hopeToLearn: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Check if age is at least 16
    if (formData.age < 16) {
      setError("Age must be at least 16");
      return;
    }

    // Reset errors
    setError("");

    try {
      // Send form data to the backend
      const response = await axios.post("http://localhost:3001/create-user", formData);
      setSuccess(response.data.message);
      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };



  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={3} sx={{ maxWidth: 400, p: 3, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>Sign Up</Typography>

        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success.main">{success}</Typography>}

        <form>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            onChange={handleChange}
            margin="normal"
            required
            value={formData.firstName}
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            onChange={handleChange}
            margin="normal"
            required
            value={formData.lastName}
          />
          <TextField
            fullWidth
            type="email"
            label="Email"
            name="email"
            onChange={handleChange}
            margin="normal"
            required
            value={formData.email}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            onChange={handleChange}
            margin="normal"
            required
            value={formData.password}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            margin="normal"
            required
            value={formData.confirmPassword}
          />
          <TextField
            fullWidth
            type="number"
            label="Age (Minimum 16)"
            name="age"
            onChange={handleChange}
            margin="normal"
            required
            value={formData.age}
          />
          <TextField
            fullWidth
            label="Special Needs"
            name="specialNeeds"
            onChange={handleChange}
            margin="normal"
            required
            value={formData.specialNeeds}
          />
          <TextField
            fullWidth
            label="Hope to Learn (e.g., Cooking)"
            name="hopeToLearn"
            onChange={handleChange}
            margin="normal"
            required
            value={formData.hopeToLearn}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
        </form>
        <Typography variant="body2" display="flex" alignItems="center" justifyContent="center" marginTop={2}>
          <span>Already have an account?</span>
          <Link to="/login" style={{ marginLeft: 8, }}>
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignUp;
