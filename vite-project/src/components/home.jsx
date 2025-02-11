import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid2, Card, CardContent, Typography, Alert, CircularProgress, Button} from '@mui/material';


const Home = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3001/view-courses");
        setCourses(response.data);
      } catch (err) {
        setError("Failed to load courses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);



  return (
    <>
      <Container maxWidth="md" sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Home
      </Typography>

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}

      {error && <Alert severity="error">{error}</Alert>}

      {courses.length > 0 ? (
        <Grid2 container spacing={3}>
          {courses.map((course) => (
            <Grid2 item xs={12} sm={6} md={4} key={course.id}>
              <Card sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{course.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{course.description}</Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    ${course.price}
                  </Typography>
                  <Button variant='contained'>View</Button>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      ) : (
        !loading && <Typography variant="body1" align="center">No courses available</Typography>
      )}
    </Container>
    </>
  );
};

export default Home;
