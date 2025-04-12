import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer'; 
import { 
    Typography, 
    Box, 
    Paper, 
    Button, 
    Container 
} from '@mui/material';

const FacilitatorMessages = () => {
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get("https://resilient-hearts-api-hceyatazggfahhcp.canadacentral-01.azurewebsites.net/all-messages");
            console.log("Fetched messages:", response.data);
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleViewConversation = (userId) => {
        console.log("Clicked to view conversation with user ID:", userId);
        if (userId) {
            navigate(`/conversation/${userId}`);
        } else {
            console.error("User ID is undefined!");
        }
    };

    const uniqueMessages = messages.filter(
        (msg, index, self) =>
            index === self.findIndex((m) => m.sender_id === msg.sender_id)
    );

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
                            All Messages
                        </Typography>
                        <Typography 
                            variant="h6" 
                            sx={{ color: '#555', fontStyle: 'italic' }}
                        >
                            "View Conversations from Your Users"
                        </Typography>
                    </Box>

                    <Box 
                        sx={{ 
                            maxHeight: '400px', 
                            overflowY: 'auto', 
                            border: '1px solid #ddd', 
                            borderRadius: 2, 
                            p: 2,
                            '&::-webkit-scrollbar': { width: 8 },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#1976d2', borderRadius: 4 }
                        }}
                    >
                        {uniqueMessages.length > 0 ? (
                            uniqueMessages.map((msg) => (
                                <Box
                                    key={msg.sender_id}
                                    sx={{
                                        mb: 2,
                                        p: 2,
                                        border: '1px solid #ddd',
                                        borderRadius: 2,
                                        backgroundColor: '#fff',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                                        transition: 'transform 0.3s',
                                        '&:hover': { transform: 'scale(1.02)' }
                                    }}
                                >
                                    <Typography 
                                        variant="h6" 
                                        sx={{ color: '#333', fontWeight: 'bold', mb: 1 }}
                                    >
                                        {msg.first_name} {msg.last_name}
                                    </Typography>
                                    <Button
                                        onClick={() => handleViewConversation(msg.sender_id)}
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#1976d2',
                                            '&:hover': { backgroundColor: '#115293' },
                                            py: 1,
                                            px: 3,
                                            borderRadius: 1,
                                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                                        }}
                                    >
                                        View Conversation
                                    </Button>
                                </Box>
                            ))
                        ) : (
                            <Typography 
                                variant="body1" 
                                align="center" 
                                sx={{ color: '#666', py: 2 }}
                            >
                                No messages yet.
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Container>
            <Footer />
        </>
    );
};

export default FacilitatorMessages;