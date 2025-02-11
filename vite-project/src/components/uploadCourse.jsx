import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  Snackbar,
} from '@mui/material';

const UploadCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [contentFiles, setContentFiles] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [stepNumbers, setStepNumbers] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        "http://localhost:3001/upload-course",
        { title, description, price },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setSuccess(response.data.message);
      const courseId = response.data.courseId;
      handleContentSubmit(courseId);
    } catch (err) {
      setError(err.response?.data?.message || "Error");
    }
  };

  const handleContentSubmit = async (courseId) => {
    const formData = new FormData();
    formData.append('course_id', courseId);

    contentFiles.forEach((file, index) => {
      formData.append('content[]', file);
      formData.append('step_number[]', stepNumbers[index]);
      formData.append('content_type[]', contentTypes[index]);
    });

    try {
      const response = await axios.post(
        "http://localhost:3001/upload-content",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSuccess((prevSuccess) => prevSuccess + ` ${response.data.message}`);
      setSnackbarMessage("Course content uploaded successfully!");
      setOpenSnackbar(true);
    } catch (err) {
      setError(err.response?.data?.message || "Error uploading content");
    }
  };

  const handleFileChange = (e) => {
    setContentFiles([...e.target.files]);
  };

  const handleContentTypeChange = (e, index) => {
    const updatedContentTypes = [...contentTypes];
    updatedContentTypes[index] = e.target.value;
    setContentTypes(updatedContentTypes);
  };

  const handleStepNumberChange = (e, index) => {
    const updatedStepNumbers = [...stepNumbers];
    updatedStepNumbers[index] = e.target.value;
    setStepNumbers(updatedStepNumbers);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Upload Course
      </Typography>

      {success && <Typography color="success.main">{success}</Typography>}
      {error && <Typography color="error.main">{error}</Typography>}

      <form onSubmit={handleCourseSubmit}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            label="Price"
            variant="outlined"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Box>

        <Typography variant="h6" gutterBottom>
          Upload Course Content
        </Typography>

        <Box mb={2}>
          <Button
            variant="contained"
            component="label"
            color="primary"
          >
            Select Content Files
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              hidden
            />
          </Button>
        </Box>

        {contentFiles.length > 0 && contentFiles.map((file, index) => (
          <Box key={index} mb={3}>
            <Typography variant="body1" gutterBottom>
              {file.name}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Content Type</InputLabel>
                  <Select
                    value={contentTypes[index] || ''}
                    onChange={(e) => handleContentTypeChange(e, index)}
                    label="Content Type"
                    required
                  >
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                  </Select>
                  <FormHelperText>Choose content type</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Step Number"
                  variant="outlined"
                  type="number"
                  value={stepNumbers[index] || ''}
                  onChange={(e) => handleStepNumberChange(e, index)}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Upload
        </Button>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default UploadCourse;
