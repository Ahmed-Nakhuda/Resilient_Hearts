import React, { useEffect, useState } from 'react';
import { AppBar, Container, Typography, Grid, Card, CardContent, Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const pages = ['Products', 'Pricing', 'Blog'];
  const settings = ['Login', 'Profile', 'Logout'];

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Fetch courses (example fetch function)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3001/view-course');
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Navigate to payment page
  const navigateToPayment = (courseId) => {
    navigate(`/payment/${courseId}`);
  };

  return (
    <>
      <nav>
        <ul>
          <li><a href="/login">Login</a></li>
          <li><a href="/user-courses">My Courses</a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Home
        </Typography>

        {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}

        {error && <Alert severity="error">{error}</Alert>}

        {courses.length > 0 ? (
          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
                  <CardContent>
                    <img
                      src={`http://localhost:3001/${course.image.replace(/\\/g, '/')}`}
                      alt={course.title}
                      style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.description}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      ${course.price}
                    </Typography>
                    <Button
                      onClick={() => navigateToPayment(course.course_id)}
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                    >
                      View
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          !loading && (
            <Typography variant="body1" align="center">
              No courses available
            </Typography>
          )
        )}
      </Container>
    </>
  );
};

export default Home;
