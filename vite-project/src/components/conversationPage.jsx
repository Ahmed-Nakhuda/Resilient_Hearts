import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ConversationPage = () => {
  const { userId } = useParams(); // Get the userId from the URL
  console.log("Conversation for user with ID:", userId); // Check userId

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
        message_id: messages[messages.length - 1].message_id, // Reply to the last message
        sender_id: facilitatorId,
        reply_text: replyText,
      });

      setReplyText(""); // Clear input after reply
      fetchConversation(); // Refresh the conversation
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  return (
    <>
      <h1>Conversation with User</h1>
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px"
        }}
      >
        {messages.length > 0 ? (
          messages.map((msg) => (
            <React.Fragment key={msg.message_id}>
              <p style={{ margin: "0 0 5px 0" }}>
                <strong>{msg.first_name} {msg.last_name}:</strong> {msg.message_text}{" "}
                <span style={{ fontSize: "12px", color: "gray" }}>
                  {new Date(msg.sent_at).toLocaleString()}
                </span>
              </p>
              {msg.reply_text && (
                <p style={{ margin: "0 0 10px 20px", backgroundColor: "#f8d7da", padding: "5px", borderRadius: "5px" }}>
                  <strong>Facilitator:</strong> {msg.reply_text}{" "}
                  <span style={{ fontSize: "12px", color: "gray" }}>
                    {new Date(msg.reply_sent_at).toLocaleString()}
                  </span>
                </p>
              )}
            </React.Fragment>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>

      <textarea
        value={replyText}
        onChange={handleReplyChange}
        placeholder="Write a reply..."
        style={{ width: "100%", marginTop: "10px" }}
      />
      <button
        onClick={handleSendReply}
        style={{
          marginTop: "10px",
          backgroundColor: "blue",
          color: "white",
          padding: "5px 10px",
          border: "none",
          cursor: "pointer"
        }}
      >
        Send Reply
      </button>
    </>
  );
};

export default ConversationPage;
