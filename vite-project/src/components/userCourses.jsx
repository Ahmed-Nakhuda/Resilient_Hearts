import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Typography, Container, Paper, Box, Alert } from "@mui/material";
import Navbar from "./Navbar";
import Footer from "./Footer";

const UserCourses = () => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserCourses = async () => {
            try {
                console.log("Fetching user courses...");
                const response = await axios.get("https://resilient-hearts-api-hceyatazggfahhcp.canadacentral-01.azurewebsites.net/user-courses", {
                    withCredentials: true
                });
                console.log("User courses:", response.data);
                setCourses(response.data);
            } catch (err) {
                console.error("Error fetching user courses:", err.message);
                if (err.response && err.response.status === 401) {
                    setError("You must be logged in to view your courses.");
                } else {
                    setError("An error occurred. Please try again.");
                }
            }
        };
        fetchUserCourses();
    }, []);

    return (
        <>
            {/* Sticky Navbar */}
            <Box sx={{ position: 'sticky', top: 0, zIndex: 1100 }}>
                <Navbar />
            </Box>

            <Container>
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 4, 
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
                            My Courses
                        </Typography>
                        <Typography 
                            variant="h6" 
                            sx={{ color: '#555', fontStyle: 'italic' }}
                        >
                            "Continue Your Learning Adventure"
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <Card 
                                key={course.user_course_id} 
                                sx={{ 
                                    mb: 2, 
                                    p: 2, 
                                    borderRadius: 2, 
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'scale(1.02)' }
                                }}
                            >
                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ color: '#333' }}
                                    >
                                        {course.title}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => navigate(`course-content/${course.course_id}`)}
                                        sx={{
                                            backgroundColor: '#1976d2',
                                            '&:hover': { backgroundColor: '#115293' },
                                            py: 1,
                                            px: 3,
                                            borderRadius: 1,
                                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                                        }}
                                    >
                                        View Course
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography 
                            variant="body1" 
                            align="center" 
                            sx={{ color: '#666', mt: 3 }}
                        >
                            No courses enrolled.
                        </Typography>
                    )}
                </Paper>
            </Container>

            <Footer />
        </>
    );
};

export default UserCourses;