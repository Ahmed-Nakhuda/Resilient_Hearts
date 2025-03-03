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
    return {
      folder: "course_content", // Store files in "course_content" folder
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

// MySQL database connection 
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect()
  .then(() => console.log('Connected to MySQL database'))
  .catch((err) => console.error('Error connecting to database:', err));

  
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
  const { title, description, price } = req.body;
  const image = req.file;

  if (!title || !description || !price || !image) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO courses (title, description, price, image) VALUES (?, ?, ?, ?)',
      [title, description, price, image.path]
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



// Start server
const port = 3001;
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
