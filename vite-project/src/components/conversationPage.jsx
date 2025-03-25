import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { 
    Typography, 
    Box, 
    Paper, 
    Container, 
    TextField, 
    Button 
} from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer'; // Added Footer import

const ConversationPage = () => {
    const { userId } = useParams();
    console.log("Conversation for user with ID:", userId);

    const [messages, setMessages] = useState([]);
    const [replyText, setReplyText] = useState("");
    const [facilitatorId, setFacilitatorId] = useState(null);

    useEffect(() => {
        fetchSession();
        fetchConversation();
    }, [userId]);

    const fetchSession = async () => {
        try {
            const response = await axios.get("http://localhost:3001/check-session", { withCredentials: true });
            setFacilitatorId(response.data.user_id);
        } catch (error) {
            console.error("Error fetching session:", error);
        }
    };

    const fetchConversation = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/conversation/${userId}`);
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching conversation:", error);
        }
    };

    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    const handleSendReply = async () => {
        if (!facilitatorId || !replyText.trim()) return;

        try {
            await axios.post("http://localhost:3001/send-reply", {
                message_id: messages[messages.length - 1].message_id,
                sender_id: facilitatorId,
                reply_text: replyText,
            });
            setReplyText("");
            fetchConversation();
        } catch (error) {
            console.error("Error sending reply:", error);
        }
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
                            Conversation with User
                        </Typography>
                        <Typography 
                            variant="h6" 
                            sx={{ color: '#555', fontStyle: 'italic' }}
                        >
                            "Stay Connected with Your Learners"
                        </Typography>
                    </Box>

                    <Box 
                        sx={{ 
                            maxHeight: '400px', 
                            overflowY: 'auto', 
                            border: '1px solid #ddd', 
                            borderRadius: 2, 
                            p: 2,
                            backgroundColor: '#fff',
                            '&::-webkit-scrollbar': { width: 8 },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#1976d2', borderRadius: 4 }
                        }}
                    >
                        {messages.length > 0 ? (
                            messages.map((msg) => (
                                <React.Fragment key={msg.message_id}>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ mb: 1, color: '#333' }}
                                    >
                                        <strong>{msg.first_name} {msg.last_name}:</strong> {msg.message_text}{" "}
                                        <span style={{ fontSize: '12px', color: '#888' }}>
                                            {new Date(msg.sent_at).toLocaleString()}
                                        </span>
                                    </Typography>
                                    {msg.reply_text && (
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                mb: 2, 
                                                ml: 3, 
                                                p: 1, 
                                                backgroundColor: '#f8d7da', 
                                                borderRadius: 1, 
                                                color: '#333' 
                                            }}
                                        >
                                            <strong>Facilitator:</strong> {msg.reply_text}{" "}
                                            <span style={{ fontSize: '12px', color: '#888' }}>
                                                {new Date(msg.reply_sent_at).toLocaleString()}
                                            </span>
                                        </Typography>
                                    )}
                                </React.Fragment>
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

                    <TextField
                        value={replyText}
                        onChange={handleReplyChange}
                        placeholder="Write a reply..."
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 3, backgroundColor: '#fff' }}
                    />

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Button
                            onClick={handleSendReply}
                            variant="contained"
                            sx={{
                                backgroundColor: '#1976d2',
                                '&:hover': { backgroundColor: '#115293' },
                                py: 1,
                                px: 4,
                                borderRadius: 1,
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                            }}
                        >
                            Send Reply
                        </Button>
                    </Box>
                </Paper>
            </Container>

            {/* Footer Added */}
            <Footer />
        </>
    );
};

export default ConversationPage;