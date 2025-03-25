import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, CircularProgress, Alert, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "../stylesheets/home.css";
import Navbar from './Navbar';
import { ChevronLeft, ChevronRight } from '@mui/icons-material'; // Import icons for scroll buttons
import Footer from './Footer';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null); // Ref for the scrollable container

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
    navigate(`/course-description/${courseId}`);
  };

  // Function to scroll left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  // Function to scroll right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Navbar />
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Home
        </Typography>

        {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}

        {error && <Alert severity="error">{error}</Alert>}

        {courses.length > 0 ? (
          <div style={{ position: 'relative' }}>
            {/* Left Scroll Button */}
            <IconButton
              onClick={scrollLeft}
              sx={{
                position: 'absolute',
                left: -80,
                top: '50%',
                padding: '20px',
                transform: 'translateY(-50%)',
                zIndex: 1,
                backgroundColor: 'rgba(230, 230, 230, 0.8)',
                '&:hover': { backgroundColor: 'rgba(150, 150, 150, 1)' },
              }}
            >
              <ChevronLeft />
            </IconButton>

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              style={{
                display: 'flex',
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                gap: '16px',
                padding: '8px',
              }}
            >
              {courses.map((course) => (
                <Card
                  key={course.id}
                  sx={{
                    boxShadow: 3,
                    borderRadius: 2,
                    p: 2,
                    flex: '0 0 auto',
                    width: '400px', // Fixed width for each card
                  }}
                >
                  <CardContent>
                    <img
                      src={course.image}  // Cloudinary URL
                      alt={course.title}
                      style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                      textOverflow: "ellipsis"
                    }}>
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
              ))}
            </div>

            {/* Right Scroll Button */}
            <IconButton
              onClick={scrollRight}
              sx={{
                position: 'absolute',
                right: -80,
                top: '50%',
                padding: '20px',
                transform: 'translateY(-50%)',
                zIndex: 1,
                backgroundColor: 'rgba(230, 230, 230, 0.8)',
                '&:hover': { backgroundColor: 'rgba(150, 150, 150, 1)' },
              }}
            >
              <ChevronRight />
            </IconButton>
          </div>
        ) : (
          !loading && (
            <Typography variant="body1" align="center">
              No courses available
            </Typography>
          )
        )}
      </Container>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Home;
