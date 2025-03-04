import React, { useState, useEffect } from 'react';
import { Button, Input, Typography, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const UserProfile = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null); // To show image preview
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null); // Initially null, will fetch from session
    const navigate = useNavigate();

    // Fetch the user_id from the session
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get("http://localhost:3001/check-session", { withCredentials: true });
                setUserId(response.data.user_id); // Save user_id from session
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
            setPreview(URL.createObjectURL(selectedFile)); // Show preview before upload
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
        formData.append("user_id", userId); // Use the correct user ID from session

        try {
            const response = await axios.post("http://localhost:3001/upload-profile-picture", formData, {
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
            <Navbar />
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h4">User Profile</Typography>

                {/* Avatar Preview */}
                <Avatar 
                    src={preview || "https://via.placeholder.com/150"} 
                    sx={{ width: 120, height: 120, margin: "20px auto" }}
                />

                <Typography variant="body1">Upload profile picture</Typography>
                <Input type="file" onChange={handleFileChange} sx={{ my: 2 }} />
                
                {error && <Typography color="error">{error}</Typography>}

                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleUpload} 
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : "Upload"}
                </Button>
            </Box>
        </>
    );
};

export default UserProfile;
