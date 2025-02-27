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
        console.log("handleEnroll function called"); // Debugging line
    
        if (!userId) {
            alert("User not logged in");
            return;
        }
    
        try {
            console.log("Sending enrollment request..."); // Debugging line
            console.log("User ID:", userId); // Debugging line
            console.log("Course ID:", courseId); // Debugging line
    
            const response = await axios.post("http://localhost:3001/enroll", {
                user_id: userId,
                course_id: courseId
            });
    
            console.log("Enrollment successful:", response.data);
            
           
        } catch (error) {
            console.error("Error enrolling in course:", error);
            alert("Enrollment failed.");
        }
    };

    const navigateToCourse = (courseId) => {
         navigate(`/course-content/${courseId}`);
    }

    
    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            {error && <Typography color="error">{error}</Typography>}

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
