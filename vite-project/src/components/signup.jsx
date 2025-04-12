import React, { useState } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from './Navbar';
import Footer from './Footer';

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
      const response = await axios.post("https://resilient-hearts-api-hceyatazggfahhcp.canadacentral-01.azurewebsites.net/create-user", formData);
      setSuccess(response.data.message);
      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
    {/* Sticky Navbar */}
    <Box sx={{ position: 'sticky', top: 0, zIndex: 1100 }}>
      <Navbar />
    </Box>
      <Paper                elevation={3} 
        sx={{ 
            padding: 4, 
            maxWidth: 400, 
            margin: "auto", 
            mt: 5,
            borderRadius: 2, 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)' 
        }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
                variant="h4" 
                sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
            >
                Sign Up
            </Typography>
            <Typography 
                variant="h6" 
                sx={{ color: '#555', fontStyle: 'italic' }}
            >
                "Start Your Learning Journey"
            </Typography>
        </Box>

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
            fullWidth 
            sx={{ 
                mt: 2, 
                py: 1.5, 
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#115293' },
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                borderRadius: 1
            }}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
        </form>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Already have an account?{' '}
            <Link 
                to="/login" 
                style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}
            >
                Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    <Footer />
    </>
  );
};

export default SignUp;
