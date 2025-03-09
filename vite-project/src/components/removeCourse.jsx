import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const RemoveCourse = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false); // State for Dialog
    const [courseToDelete, setCourseToDelete] = useState(null); // Store course to delete
    const [courseName, setCourseName] = useState(""); // Store the name of the course to delete
    const navigate = useNavigate();

    // Fetch courses from the database
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

    // Handle course removal from the database
    const handleRemoveCourse = async (courseId) => {
        try {
            const response = await axios.delete(`http://localhost:3001/delete-course/${courseId}`, {
                withCredentials: true
            });

            if (response.status === 200) {
                // Remove the course from the local state after successful deletion
                setCourses(courses.filter(course => course.course_id !== courseId));
                setOpen(false); // Close dialog after deletion
            }
        } catch (err) {
            console.error("Error removing course:", err);
            setError("An error occurred while removing the course.");
        }
    };

    // Open the confirmation dialog
    const handleOpenDialog = (courseId, title) => {
        setCourseToDelete(courseId);
        setCourseName(title); // Set the course name for the confirmation
        setOpen(true);
    };

    // Close the confirmation dialog
    const handleCloseDialog = () => {
        setOpen(false);
        setCourseToDelete(null); // Reset course to delete
        setCourseName(""); // Reset course name
    };

    return (
        <>
            <Navbar />
            {loading ? (
                <Typography>Loading courses...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : courses.length > 0 ? (
                courses.map((course) => (
                    <Card key={course.course_id} sx={{ mb: 2, p: 2 }}>
                        <CardContent>
                            <Typography variant="h6">{course.title}</Typography>
                            <Typography variant="body2" color="textSecondary">{course.description}</Typography>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleOpenDialog(course.course_id, course.title)} // Open dialog with course name
                            >
                                Remove Course
                            </Button>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography>No courses available</Typography>
            )}

            {/* Confirmation Dialog */}
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                aria-labelledby="confirmation-dialog-title"
                aria-describedby="confirmation-dialog-description"
            >
                <DialogTitle id="confirmation-dialog-title">{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <Typography id="confirmation-dialog-description">
                        Are you sure you want to delete the course{" "}
                        <span style={{ fontWeight: 'bold' }}>{courseName}? </span>This action cannot be undone.
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button variant='contained' onClick={handleCloseDialog}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (courseToDelete) {
                                handleRemoveCourse(courseToDelete);
                            }
                        }}
                        variant='contained'
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default RemoveCourse;
