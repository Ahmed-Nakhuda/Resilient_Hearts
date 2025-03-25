import React, { useState, useEffect } from 'react';
import { 
    Button, 
    Card, 
    CardContent, 
    Typography, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Container, 
    Paper, 
    Box, 
    CircularProgress 
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer'; // Added Footer import

const RemoveCourse = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [courseName, setCourseName] = useState("");
    const navigate = useNavigate();

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

    const handleRemoveCourse = async (courseId) => {
        try {
            const response = await axios.delete(`http://localhost:3001/delete-course/${courseId}`, {
                withCredentials: true
            });
            if (response.status === 200) {
                setCourses(courses.filter(course => course.course_id !== courseId));
                setOpen(false);
            }
        } catch (err) {
            console.error("Error removing course:", err);
            setError("An error occurred while removing the course.");
        }
    };

    const handleOpenDialog = (courseId, title) => {
        setCourseToDelete(courseId);
        setCourseName(title);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setCourseToDelete(null);
        setCourseName("");
    };

    return (
        <>
            {/* Sticky Navbar */}
            <Box sx={{ position: 'sticky', top: 0, zIndex: 1100 }}>
                <Navbar />
            </Box>

            {/* Enhanced Body Design */}
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
                            sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
                        >
                            Remove Course
                        </Typography>
                        <Typography 
                            variant="h6" 
                            sx={{ color: '#555', fontStyle: 'italic' }}
                        >
                            "Manage Your Course Catalog"
                        </Typography>
                    </Box>

                    {loading ? (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                            <CircularProgress />
                            <Typography sx={{ mt: 2, color: '#666' }}>
                                Loading courses...
                            </Typography>
                        </Box>
                    ) : error ? (
                        <Typography color="error" align="center" sx={{ py: 3 }}>
                            {error}
                        </Typography>
                    ) : courses.length > 0 ? (
                        courses.map((course) => (
                            <Card 
                                key={course.course_id} 
                                sx={{ 
                                    mb: 3, 
                                    borderRadius: 2, 
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'scale(1.02)' }
                                }}
                            >
                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                                    <Box>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ color: '#333', fontWeight: 'bold' }}
                                        >
                                            {course.title}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ color: '#666' }}
                                        >
                                            {course.description}
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleOpenDialog(course.course_id, course.title)}
                                        sx={{
                                            py: 1,
                                            px: 3,
                                            borderRadius: 1,
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                                        }}
                                    >
                                        Remove Course
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography 
                            variant="body1" 
                            align="center" 
                            sx={{ color: '#666', py: 3 }}
                        >
                            No courses available
                        </Typography>
                    )}

                    {/* Confirmation Dialog */}
                    <Dialog
                        open={open}
                        onClose={handleCloseDialog}
                        aria-labelledby="confirmation-dialog-title"
                        aria-describedby="confirmation-dialog-description"
                    >
                        <DialogTitle id="confirmation-dialog-title">Confirm Deletion</DialogTitle>
                        <DialogContent>
                            <Typography id="confirmation-dialog-description">
                                Are you sure you want to delete the course{" "}
                                <span style={{ fontWeight: 'bold' }}>{courseName}</span>? This action cannot be undone.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button 
                                variant="contained" 
                                onClick={handleCloseDialog}
                                sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    if (courseToDelete) {
                                        handleRemoveCourse(courseToDelete);
                                    }
                                }}
                                variant="contained"
                                color="error"
                            >
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Paper>
            </Container>

            {/* Footer Added */}
            <Footer />
        </>
    );
};

export default RemoveCourse;