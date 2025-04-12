import express from 'express';
import 'dotenv/config';
import mysql from 'mysql2/promise';
import cors from "cors";
import bcrypt from 'bcrypt';
import session from 'express-session';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer storage to use CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folderName = "course_content"; // Default folder for course content

    if (req.path === "/upload-profile-picture") {
      folderName = "profile_pictures"; // Profile pictures go in "profile_pictures"
    }
    
    return {
      folder: folderName,
      format: file.mimetype.split("/")[1], // Extract file extension dynamically
      resource_type: file.mimetype === "application/pdf" ? "raw" : "auto", // Treat PDFs as "raw"
    };
  },
});


const upload = multer({ storage });

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


// Azure MySQL database connection 
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true
  }
});


// Route to create a user
app.post('/create-user', async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, age, specialNeeds, hopeToLearn, role = 'user' } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword || !age || !specialNeeds || !hopeToLearn) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  if (age < 16) {
    return res.status(400).json({ message: 'Age must be at least 16' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (first_name, last_name, email, password, age, special_needs, hope_to_learn, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, age, specialNeeds, hopeToLearn, role]
    );
    res.status(201).json({ message: 'Account created successfully', userId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
    console.log(err);
  }
});


// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = users[0];
    if (await bcrypt.compare(password, user.password)) {
      req.session.user = { id: user.user_id, role: user.role };
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});


// Logout route
app.post('/logout', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'No active session to logout from' });
  }

  try {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Error logging out' });
      }
      
      // Clear the session cookie
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout successful' });
    });
  } catch (err) {
    console.error('Error during logout:', err);
    res.status(500).json({ message: 'Error logging out', error: err.message });
  }
});


// Check session route
app.get("/check-session", (req, res) => {
  if (req.session.user) {
    res.json({ user_id: req.session.user.id, role: req.session.user.role });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});


// Get user details
app.get('/user', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  res.json(req.session.user);
});


// Route to upload a course with an image using Cloudinary
app.post('/upload-course', upload.single('image'), async (req, res) => {
  const { title, description, price, quote, duration } = req.body;
  const image = req.file;

  if (!title || !description || !price || !image || !quote || !duration) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO courses (title, description, price, image, quote, duration) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, price, image.path, quote, duration]
    );
    res.status(201).json({ message: 'Course uploaded successfully', courseId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading course', error: err.message });
    console.log(err);
  }
});


// Route to fetch all courses
app.get('/view-course', async (req, res) => {
  try {
    const [courses] = await db.execute('SELECT * FROM courses');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses', error: err.message });
    console.log(err);
  }
});


// Route to fetch course by ID
app.get('/view-course/:courseId', async (req, res) => {
  const { courseId } = req.params;
  try {
    const [course] = await db.execute('SELECT * FROM courses WHERE course_id = ?', [courseId]);
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching course', error: err.message });
    console.log(err);
  }
});


// Route to fetch course content by course ID
app.get('/view-course-content/:courseId', async (req, res) => {
  const { courseId } = req.params;
  if (!courseId) {
    return res.status(400).json({ message: 'Course ID is required' });
  }
  try {
    const [content] = await db.execute('SELECT * FROM course_content WHERE course_id = ?', [courseId]);
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching course content', error: err.message });
    console.log(err);
  }
});


// Payment page for a specific course
app.get('/payment/:courseId', async (req, res) => {
  const { courseId } = req.params;
  if (!courseId) {
    return res.status(400).json({ message: 'Course ID is required' });
  }
  try {
    const [course] = await db.execute('SELECT * FROM courses WHERE id = ?', [courseId]);
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching course', error: err.message });
    console.log(err);
  }
});


// Route to upload course content
app.post('/upload-content', upload.array('content[]'), (req, res) => {
  console.log("Incoming request body:", JSON.stringify(req.body, null, 2));
  console.log("Uploaded files:", JSON.stringify(req.files, null, 2));

  const { course_id } = req.body;
  const files = req.files;
  const stepNumbers = req.body.step_number;
  const contentTypes = req.body.content_type;
  const contentDescriptions = req.body.content_description;

  if (!course_id || !files.length || !stepNumbers || !contentTypes || !contentDescriptions) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  files.forEach((file, index) => {
    console.log("Processing file:", JSON.stringify(file, null, 2));

    const fileUrl = file.path;
    const contentType = contentTypes[index];
    const stepNumber = stepNumbers[index];
    const contentDescription = contentDescriptions[index];

    const query = 'INSERT INTO course_content (course_id, content_type, content_url, step_number, content_description) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [course_id, contentType, fileUrl, stepNumber, contentDescription], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: 'Error uploading content' });
      }
    });
  });

  res.json({ message: 'Content uploaded successfully' });
});


// Route to enroll a user in a course
app.post("/enroll", async (req, res) => {
  const { user_id, course_id } = req.body;
  if (!user_id || !course_id) {
    return res.status(400).json({ error: "user_id and course_id are required" });
  }
  try {
    const [existingEnrollment] = await db.execute(
      "SELECT 1 FROM user_courses WHERE user_id = ? AND course_id = ?",
      [user_id, course_id]
    );
    if (existingEnrollment.length > 0) {
      return res.status(400).json({ error: "User is already enrolled in this course" });
    }
    const [result] = await db.execute(
      "INSERT INTO user_courses (user_id, course_id, completed) VALUES (?, ?, FALSE)",
      [user_id, course_id]
    );
    console.log("User enrolled, enrollment ID:", result.insertId);
    res.status(201).json({ message: "User enrolled successfully", enrollment_id: result.insertId });
  } catch (err) {
    console.error("Error enrolling user:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// Route to fetch courses for a user
app.get("/user-courses", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const user_id = req.session.user.id;
  console.log("Fetching courses for user_id:", user_id);
  try {
    const [results] = await db.execute(`
            SELECT uc.user_course_id, uc.course_id, uc.enrolled_at, uc.completed, c.title
            FROM user_courses uc
            JOIN courses c ON uc.course_id = c.course_id
            WHERE uc.user_id = ?`, [user_id]);
    res.json(results);
  } catch (err) {
    console.error("Error fetching user courses:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// Remove a course from a user's account
app.delete("/remove-course/:userCourseId", async (req, res) => {
  const { userCourseId } = req.params;

  if (!userCourseId) {
    return res.status(400).json({ error: "userCourseId is required" });
  }

  try {
    const [result] = await db.execute(
      "DELETE FROM user_courses WHERE user_course_id = ?",
      [userCourseId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found in user's account" });
    }

    res.status(200).json({ message: "Course removed successfully" });
  } catch (err) {
    console.error("Error removing course:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// Remove a course from the database
app.delete("/delete-course/:courseId", async (req, res) => {
  const { courseId } = req.params;

  if (!courseId) {
    return res.status(400).json({ error: "courseId is required" });
  }

  try {
    const [result] = await db.execute(
      "DELETE FROM courses WHERE course_id = ?",
      [courseId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json({ message: "Course removed successfully" });
  } catch (err) {
    console.error("Error removing course:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// Upload user profile picture
app.post("/upload-profile-picture", upload.single('profilePicture'), async (req, res) => {
  const { user_id } = req.body;
  const profilePicture = req.file;

  if (!user_id || !profilePicture) {
    return res.status(400).json({ message: 'User ID and profile picture are required' });
  }

  try {
    const imageUrl = profilePicture.path || profilePicture.secure_url; 

    const [result] = await db.execute(
      'UPDATE users SET profile_picture = ? WHERE user_id = ?', 
      [imageUrl, user_id]
    );

    res.status(201).json({ message: 'Profile picture uploaded successfully', imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading profile picture', error: err.message });
    console.log(err);
  }
});


// Route to fetch user profile information, including profile picture
app.get("/user/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
      const [user] = await db.execute('SELECT profile_picture FROM users WHERE user_id = ?', [user_id]);
      if (user.length > 0) {
          res.json({ profile_picture: user[0].profile_picture });
          console.log("Profile picture sent:", user[0].profile_picture);
      } else {
          res.status(404).json({ message: "User not found" });
      }
  } catch (err) {
      res.status(500).json({ message: "Error fetching user profile", error: err.message });
  }
});


// route to create a post in my community page
app.post("/create-post", async (req, res) => {
  const { user_id, post_description } = req.body;

  if (!user_id || !post_description) {
      return res.status(400).json({ message: "User ID and post description are required" });
  }

  try {
      const [result] = await db.execute(
          "INSERT INTO posts (user_id, post_description) VALUES (?, ?)",
          [user_id, post_description]
      );

      res.status(201).json({ message: "Post created successfully", post_id: result.insertId });
  } catch (err) {
      console.error("Error creating post:", err);
      res.status(500).json({ message: "Database error", error: err.message });
  }
});


// route to fetch all posts
app.get("/posts", async (req, res) => {
  try {
      const [posts] = await db.execute(`
          SELECT p.post_id, p.post_description, p.likes, p.created_at,
                 u.first_name, u.last_name, u.profile_picture
          FROM posts p
          JOIN users u ON p.user_id = u.user_id
          ORDER BY p.created_at DESC
      `);

      res.json(posts);
  } catch (err) {
      console.error("Error fetching posts:", err);
      res.status(500).json({ message: "Database error", error: err.message });
  }
});

// route to like a post 
app.post("/like-post", async (req, res) => {
  const { user_id, post_id } = req.body;

  if (!user_id || !post_id) {
      return res.status(400).json({ message: "User ID and Post ID are required" });
  }

  try {
      // Check if the user has already liked the post
      const [existingLike] = await db.execute(
          "SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?",
          [user_id, post_id]
      );

      if (existingLike.length > 0) {
          return res.status(400).json({ message: "You have already liked this post" });
      }

      // Insert the like
      await db.execute(
          "INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)",
          [user_id, post_id]
      );

      // Increment the like count in posts table
      await db.execute(
          "UPDATE posts SET likes = likes + 1 WHERE post_id = ?",
          [post_id]
      );

      res.json({ message: "Post liked successfully" });
  } catch (err) {
      console.error("Error liking post:", err);
      res.status(500).json({ message: "Database error", error: err.message });
  }
});


// route to get liked posts
app.get("/liked-posts/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
      const [likedPosts] = await db.execute(
          "SELECT post_id FROM post_likes WHERE user_id = ?",
          [user_id]
      );

      res.json(likedPosts);
  } catch (err) {
      console.error("Error fetching liked posts:", err);
      res.status(500).json({ message: "Database error", error: err.message });
  }
});


// route to reply to a post 
app.post("/reply-post", async (req, res) => {
  const { user_id, post_id, reply_description } = req.body;

  if (!user_id || !post_id || !reply_description) {
      return res.status(400).json({ message: "User ID, Post ID, and Reply description are required" });
  }

  try {
      const [result] = await db.execute(
          "INSERT INTO post_replies (user_id, post_id, reply_description) VALUES (?, ?, ?)",
          [user_id, post_id, reply_description]
      );

      res.status(201).json({ message: "Reply created successfully", reply_id: result.insertId });
  } catch (err) {
      console.error("Error creating reply:", err);
      res.status(500).json({ message: "Database error", error: err.message });
  }
});


// route to fetch replies for a post
app.get("/replies/:post_id", async (req, res) => {
  const { post_id } = req.params;

  try {
      const [replies] = await db.execute(`
          SELECT pr.reply_id, pr.reply_description, pr.created_at,
                 u.first_name, u.last_name, u.profile_picture
          FROM post_replies pr
          JOIN users u ON pr.user_id = u.user_id
          WHERE pr.post_id = ?
          ORDER BY pr.created_at ASC
      `, [post_id]);

      res.json(replies);
  } catch (err) {
      console.error("Error fetching replies:", err);
      res.status(500).json({ message: "Database error", error: err.message });
  }
});


// send message to facilitator
app.post("/send-message", async (req, res) => {
  const { sender_id, message_text } = req.body;

  if (!sender_id || !message_text.trim()) {
      return res.status(400).json({ error: "Message cannot be empty." });
  }

  try {
      await db.execute(
          "INSERT INTO messages (sender_id, message_text) VALUES (?, ?)",
          [sender_id, message_text]
      );
      res.status(201).json({ message: "Message sent successfully!" });
  } catch (err) {
      console.error("Error sending message:", err);
      res.status(500).json({ error: "Database error" });
  }
});


// fetch messages and replies for a user
app.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [messages] = await db.execute(`
      SELECT m.message_id, m.message_text, m.sent_at,
             r.reply_id, r.reply_text, r.sent_at AS reply_sent_at
      FROM messages m
      LEFT JOIN replies r ON m.message_id = r.message_id
      WHERE m.sender_id = ?
      ORDER BY m.sent_at ASC, r.sent_at ASC
    `, [userId]);

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// Endpoint to send reply to a user as facilitator
app.post("/send-reply", async (req, res) => {
  const { message_id, sender_id, reply_text } = req.body;

  if (!message_id || !sender_id || !reply_text.trim()) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await db.execute(
      "UPDATE messages SET reply_text = ?, reply_sent_at = NOW() WHERE message_id = ?",
      [reply_text, message_id]
    );
    res.status(200).json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({ error: "Database error" });
  }
});


// fetch all messages
app.get("/all-messages", async (req, res) => {
  try {
    const [messages] = await db.execute(`
      SELECT m.message_id, m.message_text, m.sent_at,
             m.sender_id, u.first_name, u.last_name
      FROM messages m
      JOIN users u ON m.sender_id = u.user_id
      ORDER BY m.sent_at ASC
    `);
    console.log("Fetched messages:", messages); // Log the messages to ensure sender_id is included
    res.json(messages);
  } catch (err) {
    console.error("Error fetching all messages:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// display reply from facilitator to user
app.get("/replies/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [messages] = await db.execute(`
      SELECT m.message_id, m.message_text, m.sent_at, 
             r.reply_id, r.reply_text, r.sent_at AS reply_sent_at
      FROM messages m
      LEFT JOIN replies r ON m.message_id = r.message_id
      WHERE m.sender_id = ?
      ORDER BY m.sent_at ASC, r.sent_at ASC
    `, [userId]);

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// Endpoint to fetch all messages (with embedded replies) for a given user (userId)
app.get("/conversation/:userId", async (req, res) => {
  const { userId } = req.params; // Extract userId from the URL parameters

  try {
    // Updated query: select reply info directly from the messages table
    const [messages] = await db.execute(`
      SELECT m.message_id, 
             m.message_text, 
             m.sent_at, 
             m.reply_text,
             m.reply_sent_at,
             u.first_name, 
             u.last_name
      FROM messages m
      JOIN users u ON m.sender_id = u.user_id
      WHERE m.sender_id = ?
      ORDER BY m.sent_at ASC;
    `, [userId]);

    // Send the messages with embedded replies as the response
    res.json(messages);
  } catch (err) {
    console.error("Error fetching conversation:", err);
    res.status(500).json({ error: "Database error" });
  }
});



// Route to upload a meeting link
app.post('/upload-meeting', async (req, res) => {
  const { title, link, description, time, duration } = req.body

  if (!title || !link || !description || !time || !duration) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    const sql = `
      INSERT INTO meeting_links (title, link, description, meeting_time, duration)
      VALUES (?, ?, ?, ?, ?)
    `
    await db.execute(sql, [title, link, description, time, duration])

    res.status(201).json({ message: 'Meeting uploaded successfully' })
  } catch (error) {
    console.error('Error inserting meeting:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Route to fetch all upcoming meeting links
app.get('/get-meetings', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT * FROM meeting_links
      WHERE meeting_time >= NOW() 
      ORDER BY meeting_time ASC
    `)
    res.status(200).json(rows)
  } catch (error) {
    console.error('Error fetching meetings:', error)
    res.status(500).json({ message: 'Server error' })
  }
})


// Start server
const port = 3001;
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
