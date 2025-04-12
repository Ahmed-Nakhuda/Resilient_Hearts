import React, { useState, useEffect } from 'react';
import { 
    Button, 
    Input, 
    Typography, 
    Box, 
    Avatar, 
    Paper, 
    Container, 
    Alert 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer'; // Added Footer import

const UserProfile = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get("https://resilient-hearts-api-hceyatazggfahhcp.canadacentral-01.azurewebsites.net/check-session", { withCredentials: true });
                setUserId(response.data.user_id);
            } catch (err) {
                console.error("Session error:", err);
                setError("You must be logged in to upload a profile picture.");
                navigate('/login');
            }
        };
        fetchUserId();
    }, [navigate]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }

        if (!userId) {
            setError("User ID is missing. Please log in.");
            return;
        }

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append("profilePicture", file);
        formData.append("user_id", userId);

        try {
            const response = await axios.post("https://resilient-hearts-api-hceyatazggfahhcp.canadacentral-01.azurewebsites.net/upload-profile-picture", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Upload successful:", response.data);
            alert("Profile picture updated successfully!");
        } catch (err) {
            console.error("Upload error:", err);
            setError("Failed to upload profile picture.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            {/* Sticky Navbar */}
            <Box sx={{ position: 'sticky', top: 0, zIndex: 1100 }}>
                <Navbar />
            </Box>

            {/* Enhanced Body Design */}
            <Container maxWidth="sm" sx={{ py: 5 }}>
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 4, 
                        borderRadius: 2, 
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)' 
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography 
                            variant="h3" 
                            sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
                        >
                            User Profile
                        </Typography>
                        <Typography 
                            variant="h6" 
                            sx={{ color: '#555', fontStyle: 'italic' }}
                        >
                            "Personalize Your Account"
                        </Typography>
                    </Box>

                    {/* Avatar Preview */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Avatar 
                            src={preview || "https://via.placeholder.com/150"} 
                            sx={{ width: 120, height: 120, margin: "0 auto", border: '3px solid #1976d2' }}
                        />
                    </Box>

                    <Typography 
                        variant="body1" 
                        sx={{ textAlign: 'center', color: '#333', mb: 2 }}
                    >
                        Upload Profile Picture
                    </Typography>

                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Button
                            variant="contained"
                            component="label"
                            sx={{
                                backgroundColor: '#1976d2',
                                '&:hover': { backgroundColor: '#115293' },
                                py: 1,
                                px: 3,
                                borderRadius: 1,
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                            }}
                        >
                            Select Image
                            <Input 
                                type="file" 
                                onChange={handleFileChange} 
                                sx={{ display: 'none' }} 
                            />
                        </Button>
                        {file && (
                            <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                                {file.name}
                            </Typography>
                        )}
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <Box sx={{ textAlign: 'center' }}>
                        <Button 
                            variant="contained" 
                            onClick={handleUpload} 
                            disabled={uploading}
                            sx={{
                                backgroundColor: '#1976d2',
                                '&:hover': { backgroundColor: '#115293' },
                                py: 1.5,
                                px: 4,
                                borderRadius: 1,
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                            }}
                        >
                            {uploading ? "Uploading..." : "Upload"}
                        </Button>
                    </Box>
                </Paper>
            </Container>

            {/* Footer Added */}
            <Footer />
        </>
    );
};

export default UserProfile;