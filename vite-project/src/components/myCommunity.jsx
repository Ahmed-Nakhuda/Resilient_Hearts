import { useState, useEffect } from "react";
import { Typography, Card, CardContent, Button, Box, TextField, CardActions } from '@mui/material';
import axios from "axios";
import Navbar from "./Navbar";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Textarea from '@mui/joy/Textarea';
import "../stylesheets/myCommunity.css";
import Avatar from '@mui/material/Avatar';

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [postDescription, setPostDescription] = useState("");
  const [userId, setUserId] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [replyFormVisible, setReplyFormVisible] = useState({});
  const [replyText, setReplyText] = useState({});
  const [replies, setReplies] = useState({});

  // Fetch session to get user ID
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
    fetchPosts();
  }, []);

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Handle like button click
  const handleLikePost = async (postId) => {
    if (likedPosts.has(postId)) return; // Prevent duplicate likes

    try {
      await axios.post("http://localhost:3001/like-post", { user_id: userId, post_id: postId });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );

      setLikedPosts(new Set([...likedPosts, postId])); // Mark as liked
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Handle new post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!postDescription.trim() || !userId) return;

    try {
      await axios.post("http://localhost:3001/create-post", {
        user_id: userId,
        post_description: postDescription,
      });

      setPostDescription(""); // Clear input after posting
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Fetch replies for a given post
  const getReplies = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:3001/replies/${postId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  // Toggle the reply form for a post and fetch its replies if opening
  const toggleReplyForm = async (postId) => {
    // Toggle form visibility
    setReplyFormVisible(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    // If opening the form (i.e. it was previously closed), fetch replies
    if (!replyFormVisible[postId]) {
      const fetchedReplies = await getReplies(postId);
      setReplies(prev => ({
        ...prev,
        [postId]: fetchedReplies,
      }));
    }
  };

  // Handle reply form input changes
  const handleReplyChange = (postId, value) => {
    setReplyText(prev => ({
      ...prev,
      [postId]: value,
    }));
  };

  // Handle reply submission for a specific post
  const handleReplySubmit = async (e, postId) => {
    e.preventDefault();
    const text = replyText[postId];
    if (!text?.trim() || !userId) return;

    try {
      await axios.post("http://localhost:3001/reply-post", {
        user_id: userId,
        post_id: postId,
        reply_description: text,
      });

      // Clear the input
      setReplyText(prev => ({
        ...prev,
        [postId]: "",
      }));

      // Refresh replies for this post
      const updatedReplies = await getReplies(postId);
      setReplies(prev => ({
        ...prev,
        [postId]: updatedReplies,
      }));
    } catch (error) {
      console.error("Error creating reply:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div>
        {/* Post Input Form */}
        <form onSubmit={handlePostSubmit}>
          <Box sx={{ margin: "1rem" }}>
            <TextField
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
              placeholder="Share your thoughts..."
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: "1rem" }}
            />
            <Button type="submit" variant="contained" color="primary">
            Post
            </Button>
          </Box>
        </form>        

        {/* Display Posts */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {posts.map((post) => (
            <Card key={post.post_id} sx={{ width: "50%", margin: "10px 0", boxShadow: 3 }}>
              <CardContent>
                {/* Post Header */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                  <Avatar
                    // src={post.profile_picture || "/images/avatar.png"} 
                    sx={{ width: 40, height: 40, marginRight: "10px" }}
                  />
                  <div>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {post.first_name} {post.last_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(post.created_at).toLocaleString()}
                    </Typography>
                  </div>
                </div>

                {/* Post Content */}
                <Typography variant="body1">{post.post_description}</Typography>
              </CardContent>

              {/* Actions: Like & Reply */}
              <CardActions sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  {likedPosts.has(post.post_id) ? (
                    <FavoriteIcon color="error" onClick={() => handleLikePost(post.post_id)} />
                  ) : (
                    <FavoriteBorderOutlinedIcon onClick={() => handleLikePost(post.post_id)} />
                  )}
                  <Typography color="text.secondary">{post.likes}</Typography>
                </div>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => toggleReplyForm(post.post_id)}
                >
                  {replyFormVisible[post.post_id] ? "Close Replies" : "Reply"}
                </Button>
              </CardActions>


              {/* Reply Form & Replies */}
              {replyFormVisible[post.post_id] && (
                <CardContent sx={{ borderTop: "1px solid #eee", paddingLeft: "16px" }}>
                  <form onSubmit={(e) => handleReplySubmit(e, post.post_id)}>
                    <Textarea
                      value={replyText[post.post_id] || ""}
                      onChange={(e) => handleReplyChange(post.post_id, e.target.value)}
                      placeholder="Write your reply..."
                      minRows={2}
                      style={{ width: "100%" }}
                    />
                    <Button variant="contained" type="submit" size="small" sx={{ marginTop: "5px" }}>
                      Submit Reply
                    </Button>
                  </form>

                  {/* Display Replies */}
                  {replies[post.post_id] && replies[post.post_id].length > 0 ? (
                    replies[post.post_id].map(reply => (
                      <Card key={reply.reply_id} sx={{ marginTop: "10px", padding: "10px", backgroundColor: "#f9f9f9" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            // src={reply.profile_picture || "/images/avatar.png"} 
                            sx={{ width: 30, height: 30, marginRight: "8px" }}
                          />
                          <Typography variant="subtitle2" fontWeight="bold">
                            {reply.first_name} {reply.last_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ marginLeft: "8px" }}>
                            {new Date(reply.created_at).toLocaleString()}
                          </Typography>
                        </div>
                        <Typography variant="body2" sx={{ marginTop: "5px" }}>
                          {reply.reply_description}
                        </Typography>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="caption" color="text.secondary">No replies yet.</Typography>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Post;
