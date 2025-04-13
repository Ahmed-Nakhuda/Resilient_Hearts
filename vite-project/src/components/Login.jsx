import { useState } from "react";
import { TextField, Button, Typography, Box, Paper, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from './Navbar';
import Footer from './Footer';

const Login = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

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

            axios.get("http://localhost:3001/check-session", { withCredentials: true })
                .then((res) => {
                    if (res.data.role === "admin") {
                        navigate("/");
                    } else if (res.data.role === "user") {
                        navigate("/");
                    } else if (res.data.role === "facilitator") {
                        navigate("/");
                    } else if (res.data.role === "enrolled") {
                        navigate("/");
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
        <>
            {/* Sticky Navbar */}
            <Box sx={{ position: 'sticky', top: 0, zIndex: 1100 }}>
                <Navbar />
            </Box>

            <Paper 
                elevation={3} 
                sx={{ 
                    padding: 4, 
                    maxWidth: 400, 
                    margin: "auto", 
                    mt: 5,
                    borderRadius: 2, 
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)' 
                }}
            >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography 
                        variant="h4" 
                        sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
                    >
                        Login
                    </Typography>
                    <Typography 
                        variant="h6" 
                        sx={{ color: '#555', fontStyle: 'italic' }}
                    >
                        "Access Your Learning Journey"
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        name="email"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={formData.email}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
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
                        sx={{ mb: 2 }}
                    />
                    <Button 
                        variant="contained" 
                        type="submit" 
                        fullWidth 
                        sx={{ 
                            mt: 2, 
                            py: 1.5, 
                            backgroundColor: '#1976d2',
                            '&:hover': { backgroundColor: '#115293' },
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                            borderRadius: 1
                        }}
                    >
                        Login
                    </Button>
                </form>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        Don’t have an account?{' '}
                        <Link 
                            to="/signup" 
                            style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}
                        >
                            Sign up
                        </Link>
                    </Typography>
                </Box>
            </Paper>

            <Footer />
        </>
    );
};

export default Login;
