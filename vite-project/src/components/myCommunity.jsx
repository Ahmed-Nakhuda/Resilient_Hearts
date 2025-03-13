import { useState, useEffect } from "react";
import { Typography, Card, CardContent, Button, Box, TextField } from '@mui/material';
import axios from "axios";
import Navbar from "./Navbar";

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [postDescription, setPostDescription] = useState("");
  const [userId, setUserId] = useState(null);

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


  // Fetch posts that the logged-in user has liked
  const fetchLikedPosts = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:3001/liked-posts/${userId}`);
        const likedPostIds = new Set(response.data.map((post) => post.post_id));
        setLikedPosts(likedPostIds);
    } catch (error) {
        console.error("Error fetching liked posts:", error);
    }
};

// Handle like button click
const handleLike = async (postId) => {
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

  return (
    <>
      <Navbar/> 
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
        <div>
          {posts.map((post) => (
            <><Card
              key={post.id}
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                p: 2,
                flex: '0 0 auto',
                margin: '0 1rem 1rem 1rem'
              }}
            >
              <CardContent>
                <img
                    //src={post.profile_picture || "/images/avatar.png"}
                    alt="Profile"
                    width="40"
                    height="40"
                    style={{ borderRadius: "50%" }} />
                <Box display="flex">
                  <Typography variant="h6" gutterBottom>
                    {post.first_name} {post.last_name}
                  </Typography>
                  <Typography variant="body1" sx={{ marginLeft: 2 }}>
                    {new Date(post.created_at).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {post.post_description}
                </Typography>
                <Button
                  onClick={() => {post.likes}}
                  variant="contained"
                  color="primary"
                  sx={{
                    mt: 2,
                    marginRight: '1rem',
                  }}
                >
                  Like
                </Button>
                <Button
                  //onClick={() => }
                  variant="contained"
                  color="primary"
                  sx={{
                    mt: 2,
                    marginRight: '1rem',
                  }}
                >
                  Reply
                </Button>
              </CardContent>
            </Card>
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default Post;
