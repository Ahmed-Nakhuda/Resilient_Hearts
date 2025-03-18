import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom'; // Added useLocation
import Navbar from './Navbar';
import Footer from './Footer';
import { 
    Button, 
    Container, 
    Typography, 
    Box, 
    Paper,
    Divider 
} from '@mui/material';
import { 
    AccessTime,
    Assessment,
    Book,
    SelfImprovement,
    Headphones
} from '@mui/icons-material';

const StressManagement = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const location = useLocation(); // Hook to track route changes

    // Scroll to top whenever the route changes
    useEffect(() => {
        window.scrollTo(0, 0); // Scrolls to the top of the page
    }, [location.pathname]); // Trigger on pathname change

    const navigateToPayment = (courseId) => {
        navigate(`/payment/${courseId}`);
    };

    const highlights = [
        { text: "Duration: Approximately 90 minutes", icon: <AccessTime sx={{ color: '#1976d2', mr: 1 }} /> },
        { text: "Interactive stress assessment tools", icon: <Assessment sx={{ color: '#1976d2', mr: 1 }} /> },
        { text: "Downloadable coping strategies workbook", icon: <Book sx={{ color: '#1976d2', mr: 1 }} /> },
        { text: "Techniques including mindfulness and breathing exercises", icon: <SelfImprovement sx={{ color: '#1976d2', mr: 1 }} /> },
        { text: "Access to guided relaxation audio sessions", icon: <Headphones sx={{ color: '#1976d2', mr: 1 }} /> }
    ];

    return (
        <>
            <Box sx={{ position: 'sticky', top: 0, zIndex: 1100 }}>
                <Navbar />
            </Box>

            <Container maxWidth="md" sx={{ py: 4 }}>
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
                            component="h1" 
                            sx={{ 
                                fontWeight: 'bold', 
                                color: '#1976d2',
                                mb: 1 
                            }}
                        >
                            Stress Management and Healthy Coping
                        </Typography>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: '#555', 
                                fontStyle: 'italic' 
                            }}
                        >
                            "Master Your Stress, Transform Your Life"
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography 
                            variant="h5" 
                            gutterBottom 
                            sx={{ fontWeight: 'medium', color: '#333' }}
                        >
                            About This Course
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                lineHeight: 1.6, 
                                color: '#666',
                                mb: 2 
                            }}
                        >
                            Welcome to "Stress Management and Healthy Coping" - an interactive online course designed to help you navigate life's challenges with confidence and resilience.
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                lineHeight: 1.6, 
                                color: '#666',
                                mb: 2 
                            }}
                        >
                            This course is perfect for individuals of all ages looking to develop practical strategies for managing stress effectively. Whether you're dealing with work pressure, personal challenges, or simply want to maintain a balanced lifestyle, this course provides you with essential tools and techniques to cope healthily.
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                lineHeight: 1.6, 
                                color: '#666' 
                            }}
                        >
                            Through engaging content and practical exercises, you'll learn how to identify stress triggers, implement relaxation techniques, and build long-term resilience. The course includes real-life scenarios and expert insights to support your journey toward better well-being.
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                        <Typography 
                            variant="h6" 
                            gutterBottom 
                            sx={{ fontWeight: 'medium', color: '#333' }}
                        >
                            Course Highlights
                        </Typography>
                        <Box sx={{ pl: 2 }}>
                            {highlights.map((highlight, index) => (
                                <Typography
                                    key={index}
                                    variant="body1"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: '#666',
                                        mb: 1.5,
                                        lineHeight: 1.6
                                    }}
                                >
                                    {highlight.icon}
                                    {highlight.text}
                                </Typography>
                            ))}
                        </Box>
                    </Box>

                    <Box sx={{ mb: 4, textAlign: 'center', bgcolor: '#fff', p: 3, borderRadius: 2 }}>
                        <Typography 
                            variant="body1" 
                            sx={{ fontStyle: 'italic', color: '#555', mb: 1 }}
                        >
                            "This course changed how I handle stress daily. The tools are practical and easy to apply!"
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#888' }}>
                            — Sarah M., Recent Participant
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <Box sx={{ textAlign: 'center' }}>
                        <Button 
                            onClick={() => navigateToPayment(courseId)} 
                            variant="contained" 
                            size="large"
                            sx={{ 
                                backgroundColor: '#1976d2',
                                '&:hover': { backgroundColor: '#115293' },
                                py: 1.5,
                                px: 4,
                                borderRadius: 1,
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                            }}
                        >
                            Enroll Now
                        </Button>
                    </Box>
                </Paper>
            </Container>

            <Footer />
        </>
    );
};

<<<<<<< Updated upstream
export default StressManagement;
=======
export default StressManagement;
>>>>>>> Stashed changes
