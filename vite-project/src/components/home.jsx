import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, Card, CardContent, Button, CircularProgress, Alert, IconButton, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "../stylesheets/home.css";
import Navbar from './Navbar';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Footer from './Footer';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:3001/view-course');
                const data = await response.json();
                setCourses(data);
            } catch (err) {
                setError('Failed to load courses');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const navigateToViewCourseDetails = (courseId) => {
        navigate(`/stress-management-and-healthy-coping/${courseId}`);
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <>
            {/* Sticky Navbar */}
            <Box sx={{ position: 'sticky', top: 0, zIndex: 1100 }}>
                <Navbar />
            </Box>

            <Container maxWidth="xl" sx={{ mt: 3 }}>
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
                            variant="h4" 
                            sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
                        >
                            Home
                        </Typography>
                        <Typography 
                            variant="h6" 
                            sx={{ color: '#555', fontStyle: 'italic' }}
                        >
                            "Unlock Your Potential with Our Courses"
                        </Typography>
                    </Box>

                    {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    {courses.length > 0 ? (
                        <div style={{ position: 'relative' }}>
                            <IconButton
                                onClick={scrollLeft}
                                sx={{
                                    position: 'absolute',
                                    left: -80,
                                    top: '50%',
                                    padding: '20px',
                                    transform: 'translateY(-50%)',
                                    zIndex: 1,
                                    backgroundColor: 'rgba(230, 230, 230, 0.8)',
                                    '&:hover': { backgroundColor: 'rgba(150, 150, 150, 1)' },
                                }}
                            >
                                <ChevronLeft />
                            </IconButton>

                            <div
                                ref={scrollContainerRef}
                                style={{
                                    display: 'flex',
                                    overflowX: 'auto',
                                    scrollBehavior: 'smooth',
                                    gap: '16px',
                                    padding: '8px',
                                }}
                            >
                                {courses.map((course) => (
                                    <Card
                                        key={course.id}
                                        sx={{
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                            borderRadius: 2,
                                            flex: '0 0 auto',
                                            width: '400px',
                                            transition: 'transform 0.3s',
                                            '&:hover': { transform: 'scale(1.03)' }
                                        }}
                                    >
                                        <CardContent sx={{ p: 2 }}>
                                            <Box 
                                                component="img"
                                                src={course.image || 'https://via.placeholder.com/400x200'}
                                                alt={course.title}
                                                sx={{ 
                                                    width: '100%', 
                                                    height: 200, 
                                                    objectFit: 'cover', 
                                                    borderRadius: 2, 
                                                    mb: 2 
                                                }}
                                            />
                                            <Typography 
                                                variant="h6" 
                                                sx={{ color: '#333', mb: 1 }}
                                            >
                                                {course.title}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ color: '#666', mb: 2 }}
                                            >
                                                {course.description}
                                            </Typography>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}
                                            >
                                                ${course.price}
                                            </Typography>
                                            <Button
                                                onClick={() => navigateToViewCourseDetails(course.course_id)}
                                                variant="contained"
                                                fullWidth
                                                sx={{
                                                    backgroundColor: '#1976d2',
                                                    '&:hover': { backgroundColor: '#115293' },
                                                    py: 1,
                                                    borderRadius: 1,
                                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                                                }}
                                            >
                                                View
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <IconButton
                                onClick={scrollRight}
                                sx={{
                                    position: 'absolute',
                                    right: -80,
                                    top: '50%',
                                    padding: '20px',
                                    transform: 'translateY(-50%)',
                                    zIndex: 1,
                                    backgroundColor: 'rgba(230, 230, 230, 0.8)',
                                    '&:hover': { backgroundColor: 'rgba(150, 150, 150, 1)' },
                                }}
                            >
                                <ChevronRight />
                            </IconButton>
                        </div>
                    ) : (
                        !loading && (
                            <Typography 
                                variant="body1" 
                                align="center" 
                                sx={{ color: '#666', mt: 3 }}
                            >
                                No courses available
                            </Typography>
                        )
                    )}
                </Paper>
            </Container>

            <Footer />
        </>
    );
};

export default Home;