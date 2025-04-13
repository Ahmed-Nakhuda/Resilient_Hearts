import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Divider,
    Card,
    CardContent,
    LinearProgress,
    Alert
} from "@mui/material";
import { CreditCard, Lock } from "@mui/icons-material";
import Navbar from './Navbar';
import Footer from './Footer';

const Payment = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [userId, setUserId] = useState(null);
    const [courseContent, setCourseContent] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Scroll to top when the page loads
    useEffect(() => {
        window.scrollTo(0, 0); // Scrolls to the top of the page
    }, []); // Empty dependency array ensures this runs only on mount

    // Fetch logged-in user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:3001/check-session", { withCredentials: true });
                setUserId(response.data.user_id);
            } catch (err) {
                console.error("Error fetching user:", err);
                setError("Please log in to continue.");
            }
        };
        fetchUser();
    }, []);

    // Fetch course details
    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3001/view-course/${courseId}`);
                console.log('API Response:', response.data);
                if (response.data && response.data.length > 0) {
                    setCourseContent(response.data);
                } else {
                    setError('Course not found');
                }
            } catch (err) {
                setError('Failed to load course details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetails(courseId);
    }, [courseId]);

    const handleEnroll = async () => {
        console.log("handleEnroll function called");
        if (!userId) {
            alert("User not logged in");
            return;
        }

        try {
            setLoading(true);
            console.log("Sending enrollment request...");
            console.log("User ID:", userId);
            console.log("Course ID:", courseId);
            const response = await axios.post("http://localhost:3001/enroll", {
                user_id: userId,
                course_id: courseId
            });

            console.log("Enrollment successful:", response.data);
            navigate("/user-courses");
        } catch (error) {
            console.error("Error enrolling in course:", error);
            alert("Enrollment failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box sx={{ position: 'sticky', top: 0, zIndex: 1100 }}>
                <Navbar />
            </Box>

            <Container maxWidth="md" sx={{ py: 5 }}>
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
                            sx={{ 
                                fontWeight: 'bold', 
                                color: '#1976d2', 
                                mb: 1 
                            }}
                        >
                            Complete Your Enrollment
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#555' }}>
                            Secure Payment for Your Course
                        </Typography>
                    </Box>

                    {loading && <LinearProgress sx={{ mb: 2 }} />}

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {courseContent.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <Typography 
                                variant="h5" 
                                sx={{ fontWeight: 'medium', color: '#333', mb: 2 }}
                            >
                                {courseContent[0].title}
                            </Typography>
                            <Typography 
                                variant="body1" 
                                sx={{ color: '#666', lineHeight: 1.6, mb: 2 }}
                            >
                                {courseContent[0].description}
                            </Typography>
                            <Typography 
                                variant="h6" 
                                sx={{ fontWeight: 'bold', color: '#1976d2' }}
                            >
                                Price: ${courseContent[0].price}
                            </Typography>
                        </Box>
                    )}

                    <Card sx={{ p: 3, borderRadius: 2, backgroundColor: '#fff' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CreditCard sx={{ color: '#1976d2', mr: 1 }} />
                                <Typography variant="h5" sx={{ color: '#333' }}>
                                    Payment Details
                                </Typography>
                            </Box>
                            <form>
                                <TextField 
                                    fullWidth 
                                    label="Name on Card" 
                                    variant="outlined" 
                                    margin="normal" 
                                    sx={{ mb: 2 }} 
                                />
                                <TextField 
                                    fullWidth 
                                    label="Card Number" 
                                    variant="outlined" 
                                    margin="normal" 
                                    sx={{ mb: 2 }} 
                                />
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField 
                                        fullWidth 
                                        label="Expiration Date (MM/YY)" 
                                        variant="outlined" 
                                        margin="normal" 
                                        sx={{ mb: 2 }} 
                                    />
                                    <TextField 
                                        fullWidth 
                                        label="CVV" 
                                        variant="outlined" 
                                        margin="normal" 
                                        type="password" 
                                        sx={{ mb: 2 }} 
                                    />
                                </Box>
                                <Button 
                                    variant="contained" 
                                    fullWidth 
                                    onClick={handleEnroll}
                                    disabled={loading}
                                    sx={{ 
                                        mt: 2, 
                                        py: 1.5, 
                                        backgroundColor: '#1976d2',
                                        '&:hover': { backgroundColor: '#115293' },
                                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                        borderRadius: 1
                                    }}
                                >
                                    {loading ? "Processing..." : "Enroll Now"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography 
                            variant="body2" 
                            sx={{ color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Lock sx={{ fontSize: 16, mr: 1, color: '#1976d2' }} />
                            Secure Payment Powered by Industry-Standard Encryption
                        </Typography>
                    </Box>
                </Paper>
            </Container>

            <Footer />
        </>
    );
};

export default Payment;