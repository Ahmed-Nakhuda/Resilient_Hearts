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
