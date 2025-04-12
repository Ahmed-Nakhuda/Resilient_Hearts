import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Card, CardContent, CardActions, Button, Avatar, Box, TextField } from '@mui/material';
import Navbar from "./Navbar";

const MessageFacilitator = () => {
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Fetch the user session to get userId
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get("https://resilient-hearts-api-hceyatazggfahhcp.canadacentral-01.azurewebsites.net/check-session", { withCredentials: true });
        setUserId(response.data.user_id);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();
  }, []);

  // Fetch the user's messages and replies
  useEffect(() => {
    if (userId) {
      fetchMessages();
    }
  }, [userId]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`https://resilient-hearts-api-hceyatazggfahhcp.canadacentral-01.azurewebsites.net/conversation/${userId}`);
      setMessages(response.data);
      console.log("Messages:", response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await axios.post("https://resilient-hearts-api-hceyatazggfahhcp.canadacentral-01.azurewebsites.net/send-message", {
        sender_id: userId,
        message_text: message,
      });

      setMessage("");
      fetchMessages(); // Reload messages after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Combine messages and facilitator replies into one array sorted by timestamp.
  const conversationItems = [];
  messages.forEach(msg => {
    // Add user's message
    conversationItems.push({
      id: msg.message_id,
      sender: "You",
      text: msg.message_text,
      timestamp: new Date(msg.sent_at)
    });
    // Add facilitator reply if exists
    if (msg.reply_text) {
      conversationItems.push({
        id: `${msg.message_id}-reply`,
        sender: "Facilitator",
        text: msg.reply_text,
        timestamp: new Date(msg.reply_sent_at)
      });
    }
  });

  // Sort all items by their timestamp so they appear in chronological order
  conversationItems.sort((a, b) => a.timestamp - b.timestamp);

  return (
    <>
      <Navbar/>
      <Box sx={{ margin: "1rem" }}>
        <Typography variant="h4" fontWeight="bold">
          Message Facilitator
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          Welcome to 1:1 coaching. Share personal messages with a facilitator.
        </Typography>
      </Box>

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage}>
        <Box sx={{ margin: "1rem" }}>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts..."
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: "1rem" }}
          />
          <Button type="submit" variant="contained" color="primary">
          Send
          </Button>
        </Box>
      </form> 

      <Typography variant="h6" fontWeight="bold" sx={{ margin: "0 1rem 0 1rem" }}>
          Your Messages
        </Typography>
      <Box sx={{ margin: "0 1rem 1rem", maxHeight: "400px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
        {conversationItems.length > 0 ? (
          conversationItems.map(item => (
            <Card 
              key={item.id}
              style={{
                textAlign: item.sender === "You" ? "left" : "right",
                marginBottom: "10px",
                padding: "8px",
                borderRadius: "5px",
                background: item.sender === "You" ? "#cce5ff" : "#f8d7da",
                display: "block",
                maxWidth: "70%"
              }}
            >
              <CardContent>
                <Typography sx={{ margin: '0' }}>
                  <strong>{item.sender}:</strong> {item.text}
                </Typography>
                <Typography sx={{ fontSize: "12px", color: "gray", margin: "0" }}>
                  {item.timestamp.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </Box>
    </>
  );
};

export default MessageFacilitator;
