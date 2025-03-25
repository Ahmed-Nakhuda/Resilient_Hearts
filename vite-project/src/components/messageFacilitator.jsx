import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MessageFacilitator = () => {
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Fetch the user session to get userId
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get("http://localhost:3001/check-session", { withCredentials: true });
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
      const response = await axios.get(`http://localhost:3001/messages/${userId}`);
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
      await axios.post("http://localhost:3001/send-message", {
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
      <h1>Message Facilitator</h1>
      <p>Welcome to 1:1 coaching. Share personal messages with a facilitator.</p>

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage}>
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="3"
          cols="50"
        ></textarea>
        <button type="submit">Send</button>
      </form>

      <h2>Your Messages</h2>
      <div style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
        {conversationItems.length > 0 ? (
          conversationItems.map(item => (
            <div 
              key={item.id}
              style={{
                textAlign: item.sender === "You" ? "left" : "right",
                marginBottom: "10px",
                padding: "8px",
                borderRadius: "5px",
                background: item.sender === "You" ? "#cce5ff" : "#f8d7da",
                display: "block", // Ensures each message takes its own line
                maxWidth: "70%"
              }}
            >
              <p style={{ margin: "0" }}>
                <strong>{item.sender}:</strong> {item.text}
              </p>
              <p style={{ fontSize: "12px", color: "gray", margin: "0" }}>
                {item.timestamp.toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
    </>
  );
};

export default MessageFacilitator;
