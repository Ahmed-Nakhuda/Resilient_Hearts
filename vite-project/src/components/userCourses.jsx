import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Typography, Container } from "@mui/material";
import Navbar from "./Navbar";

const UserCourses = () => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserCourses = async () => {
            try {
                console.log("Fetching user courses...");
                const response = await axios.get("http://localhost:3001/user-courses", {
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

    const handleRemoveCourse = async (userCourseId) => {
        try {
            const response = await axios.delete(`http://localhost:3001/remove-course/${userCourseId}`, {
                withCredentials: true
            });

            if (response.status === 200) {
                // Remove the course from the local state
                setCourses(courses.filter(course => course.user_course_id !== userCourseId));
            }
        } catch (err) {
            console.error("Error removing course:", err);
            setError("An error occurred while removing the course.");
        }
    };


    return (
        <>
            <Navbar />
            <Container>
                <Typography variant="h4" mt={5} gutterBottom>My Courses</Typography>
                {error && <Typography color="error">{error}</Typography>}
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <Card key={course.user_course_id} sx={{ mb: 2, p: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{course.title}</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate(`course-content/${course.course_id}`)} sx={{ mr: 2 }}
                                >
                                    View Course
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleRemoveCourse(course.user_course_id)}
                                >
                                    Remove Course
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography>No courses enrolled.</Typography>
                )}
            </Container>
        </>
    );
};

export default UserCourses;
