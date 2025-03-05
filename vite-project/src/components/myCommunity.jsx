import { useState, useEffect } from "react";
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
          <textarea
            value={postDescription}
            onChange={(e) => setPostDescription(e.target.value)}
            placeholder="Share your thoughts..."
            rows="3"
            style={{ width: "100%" }}
          />
          <button type="submit">Post</button>
        </form>

        {/* Display Posts */}
        <div>
          {posts.map((post) => (
            <div key={post.post_id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  //src={post.profile_picture || "/images/avatar.png"}
                  alt="Profile"
                  width="40"
                  height="40"
                  style={{ borderRadius: "50%", marginRight: "10px" }}
                />
                <div>
                  <strong>{post.first_name} {post.last_name}</strong>
                  <p style={{ fontSize: "12px", color: "gray" }}>{new Date(post.created_at).toLocaleString()}</p>
                </div>
              </div>
              <p>{post.post_description}</p>
              <button>Like ({post.likes})</button>
              <button>Reply</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Post;
