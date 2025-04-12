import React, { useEffect, useState, useRef } from 'react';
import { 
    Container, 
    Typography, 
    Card, 
    CardContent, 
    Button, 
    CircularProgress, 
    Alert, 
    IconButton, 
    Paper, 
    Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "../stylesheets/home.css";
import Navbar from './Navbar';
import Footer from './Footer';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

// Import images
import HomeImage from '../assets/home_img.png';
import Img2 from '../assets/img2.jpg';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const coursesSectionRef = useRef(null);

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
        navigate(`/payment/${courseId}`);
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

    const scrollToCourses = () => {
        if (coursesSectionRef.current) {
            coursesSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            {/* Sticky Navbar */}
            <Navbar />

            {/* Header Section Moved to Top */}
            <Box sx={{ textAlign: 'center', mt: 2, mb: 4 }}>
                <Typography 
                    variant="h3" 
                    sx={{ 
                        fontWeight: 'bold', 
                        color: '#1976d2', 
                        mb: 1, 
                        letterSpacing: 1,
                        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    Home
                </Typography>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        color: '#555', 
                        fontStyle: 'italic', 
                        fontWeight: 'medium' 
                    }}
                >
                    "Unlock Your Potential with Our Courses"
                </Typography>
            </Box>

            {/* Hero Section with Full-Width Image and Centered Button */}
            <Box 
                sx={{ 
                    position: 'relative', 
                    width: '100vw',
                    left: '50%',
                    right: '50%',
                    marginLeft: '-50vw',
                    marginRight: '-50vw',
                    mb: 6,
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.01)' }
                }}
            >
                <img 
                    src={HomeImage} 
                    alt="Welcome to Learning" 
                    style={{ 
                        width: '100%', 
                        height: 300,
                        objectFit: 'cover',
                        display: 'block'
                    }} 
                />
                <Button
                    variant="contained"
                    onClick={scrollToCourses}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        fontWeight: 'bold',
                        px: 5,
                        py: 2,
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                        '&:hover': { 
                            backgroundColor: '#115293', 
                            transform: 'translate(-50%, -50%) scale(1.05)',
                            transition: 'all 0.3s' 
                        }
                    }}
                >
                    Get Started
                </Button>
            </Box>

            {/* Main Content */}
            <Container maxWidth="xl" sx={{ mb: 6 }}>
                <Paper 
                    elevation={4} 
                    sx={{ 
                        p: { xs: 3, md: 5 }, 
                        borderRadius: 3, 
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    {/* Courses Section */}
                    <Box ref={coursesSectionRef}>
                        {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />}

                        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

                        {courses.length > 0 ? (
                            <Box sx={{ position: 'relative' }}>
                                <IconButton
                                    onClick={scrollLeft}
                                    sx={{
                                        position: 'absolute',
                                        left: { xs: -50, md: -70 },
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        zIndex: 1,
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                        '&:hover': { backgroundColor: '#fff' },
                                        p: 1.5
                                    }}
                                >
                                    <ChevronLeft sx={{ color: '#1976d2', fontSize: 30 }} />
                                </IconButton>

                                <Box
                                    ref={scrollContainerRef}
                                    sx={{
                                        display: 'flex',
                                        overflowX: 'auto',
                                        gap: 3,
                                        py: 2,
                                        px: 1,
                                        scrollBehavior: 'smooth',
                                        '&::-webkit-scrollbar': { height: 8 },
                                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#1976d2', borderRadius: 4 }
                                    }}
                                >
                                    {courses.map((course) => (
                                        <Card
                                            key={course.id}
                                            sx={{
                                                flex: '0 0 auto',
                                                width: { xs: 300, md: 400 },
                                                borderRadius: 3,
                                                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
                                                transition: 'transform 0.3s, box-shadow 0.3s',
                                                '&:hover': { 
                                                    transform: 'scale(1.03)', 
                                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)' 
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ p: 3 }}>
                                                <Box 
                                                    component="img"
                                                    src={course.image || 'https://via.placeholder.com/400x200'}
                                                    alt={course.title}
                                                    sx={{ 
                                                        width: '100%', 
                                                        height: 200, 
                                                        objectFit: 'cover', 
                                                        borderRadius: 2, 
                                                        mb: 2,
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                                    }}
                                                />
                                                <Typography 
                                                    variant="h6" 
                                                    sx={{ 
                                                        color: '#333', 
                                                        fontWeight: 'bold', 
                                                        mb: 1 
                                                    }}
                                                >
                                                    {course.title}
                                                </Typography>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        color: '#666', 
                                                        mb: 2,
                                                        lineHeight: 1.5 
                                                    }}
                                                >
                                                    {course.description}
                                                </Typography>
                                                <Typography 
                                                    variant="h6" 
                                                    sx={{ 
                                                        fontWeight: 'bold', 
                                                        color: '#1976d2', 
                                                        mb: 2 
                                                    }}
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
                                                        py: 1.5,
                                                        borderRadius: 2,
                                                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                                        fontWeight: 'bold',
                                                        textTransform: 'none'
                                                    }}
                                                >
                                                    View Course
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>

                                <IconButton
                                    onClick={scrollRight}
                                    sx={{
                                        position: 'absolute',
                                        right: { xs: -50, md: -70 },
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        zIndex: 1,
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                        '&:hover': { backgroundColor: '#fff' },
                                        p: 1.5
                                    }}
                                >
                                    <ChevronRight sx={{ color: '#1976d2', fontSize: 30 }} />
                                </IconButton>
                            </Box>
                        ) : (
                            !loading && (
                                <Typography 
                                    variant="body1" 
                                    align="center" 
                                    sx={{ color: '#666', mt: 4, fontStyle: 'italic' }}
                                >
                                    No courses available at the moment.
                                </Typography>
                            )
                        )}
                    </Box>

                    {/* About Section with Image and Paragraph Centered */}
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', md: 'row' }, 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mt: 6, 
                        gap: 4,
                        maxWidth: '1200px',
                        mx: 'auto'
                    }}>
                        <Box 
                            component="img" 
                            src={Img2} 
                            alt="Resilient Hearts" 
                            sx={{ 
                                width: { xs: '100%', md: '40%' }, 
                                maxWidth: 500, 
                                height: 'auto', 
                                borderRadius: 3, 
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'scale(1.02)' }
                            }} 
                        />
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: '#333', 
                                lineHeight: 1.8, 
                                fontSize: { xs: '1rem', md: '1.1rem' }, 
                                textAlign: { xs: 'center', md: 'left' },
                                maxWidth: '600px'
                            }}
                        >
                            Resilient Hearts is a community service organization dedicated to creating a world where everyone can live a meaningful life, shaped by their strengths rather than their challenges. The organization offers community access services tailored for young adults with developmental disabilities, helping them develop vital skills for independent living. Resilient Hearts aims to foster a nurturing and inclusive space where individuals can learn, develop, and flourish.
                        </Typography>
                    </Box>
                </Paper>
            </Container>

            <Footer />
        </>
    );
};

export default Home;
