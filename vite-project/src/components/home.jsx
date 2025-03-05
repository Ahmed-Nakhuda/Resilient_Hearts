import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "../stylesheets/home.css";
import Navbar from './Navbar';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  // Fetch courses 
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



  const navigateToViewCourseDetails = (courseId) => {
    navigate(`/stress-management-and-healthy-coping/${courseId}`);
  }

  return (
    <>
      <Navbar />
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
                      //src={course.image}  // Cloudinary URL
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
                      onClick={() => navigateToViewCourseDetails(course.course_id)}
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
