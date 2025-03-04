import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Card, CardContent } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const [userId, setUserId] = useState(null);
    const [content, setContent] = useState([]);
    const [error, setError] = useState('');

    // store the course content 
    const [courseContent, setCourseContent] = useState([]);

    useEffect(() => {
        // Fetch logged-in user
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

    const handleEnroll = async () => {
        console.log("handleEnroll function called"); 

        if (!userId) {
            alert("User not logged in");
            return;
        }

        try {
            console.log("Sending enrollment request..."); 
            console.log("User ID:", userId); 
            console.log("Course ID:", courseId); 
            const response = await axios.post("http://localhost:3001/enroll", {
                user_id: userId,
                course_id: courseId
            });

            console.log("Enrollment successful:", response.data);
            navigate("/user-courses")


        } catch (error) {
            console.error("Error enrolling in course:", error);
            alert("Enrollment failed.");
        }
    };

    // fetch course details for a single course using id
    useEffect(() => {
        const fetchCourseDetails = async (courseId) => {
            try {
                const response = await axios.get(`http://localhost:3001/view-course/${courseId}`);
                console.log('API Response:', response.data);
                if (response.data && response.data.length > 0) {
                    setCourseContent(response.data);
                } else {
                    setError('Course not found');
                }
            }
            catch (err) {
                setError('Failed to load course details');
                console.error(err);
            }
        };
        fetchCourseDetails(courseId);
    }, []);






    // const navigateToCourse = (courseId) => {
    //      navigate(`/course-content/${courseId}`);
    // }


    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            {error && <Typography color="error">{error}</Typography>}

            {courseContent.length > 0 && (
                <>
                    <Typography variant="h4" gutterBottom>{courseContent[0].title}</Typography>
                    <Typography variant="body1" gutterBottom>{courseContent[0].description}</Typography>
                    <Typography variant="h6" gutterBottom>Price: ${courseContent[0].price}</Typography>
                </>
            )}


            {content.length > 0 && (
                <>
                    <Typography variant="h4" gutterBottom>{content[0].title}</Typography>
                    <Typography variant="body1" gutterBottom>{content[0].description}</Typography>
                    <Typography variant="h6" gutterBottom>Price: ${content[0].price}</Typography>
                </>
            )}

            <Card sx={{ p: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Payment Details</Typography>
                    <form>
                        <TextField fullWidth label="Name on Card" variant="outlined" margin="normal" />
                        <TextField fullWidth label="Card Number" variant="outlined" margin="normal" />
                        <TextField fullWidth label="Expiration Date (MM/YY)" variant="outlined" margin="normal" />
                        <TextField fullWidth label="CVV" variant="outlined" margin="normal" type="password" />
                        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleEnroll}>
                            Enroll
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Payment;
