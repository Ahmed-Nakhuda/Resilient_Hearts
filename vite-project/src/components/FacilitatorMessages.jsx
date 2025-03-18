import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const FacilitatorMessages = () => {
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate(); // useNavigate for React Router v6

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get("http://localhost:3001/all-messages");
            console.log("Fetched messages:", response.data); // Log the response data
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleViewConversation = (userId) => {
        console.log("Clicked to view conversation with user ID:", userId); // Log the user ID passed
        if (userId) {
            navigate(`/conversation/${userId}`);
        } else {
            console.error("User ID is undefined!"); // Log error if ID is missing
        }
    };

    // Filter messages to only include one per sender
    const uniqueMessages = messages.filter(
        (msg, index, self) =>
            index === self.findIndex((m) => m.sender_id === msg.sender_id)
    );

    return (
        <>
            <Navbar />
            <h1>All Messages</h1>
            <p>View all messages sent by users.</p>

            <div style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
                {uniqueMessages.length > 0 ? (
                    uniqueMessages.map((msg) => (
                        <div key={msg.sender_id} style={{ margin: "10px 0", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                            <p><strong>{msg.first_name} {msg.last_name}</strong></p>
                            <button
                                onClick={() => handleViewConversation(msg.sender_id)}
                                style={{ marginTop: "5px", backgroundColor: "lightgray", padding: "5px 10px", border: "none", cursor: "pointer" }}
                            >
                                View Conversation
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No messages yet.</p>
                )}
            </div>
        </>
    );
};

export default FacilitatorMessages;
