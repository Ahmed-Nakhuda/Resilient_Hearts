import React, { useState } from 'react';
import axios from 'axios';
import { 
    Container, 
    Typography, 
    TextField, 
    Button, 
    Box, 
    Grid2, 
    InputLabel, 
    MenuItem, 
    Select, 
    FormControl, 
    FormHelperText, 
    Paper, 
    Alert 
} from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer'; // Added Footer import

const UploadCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null); // new image state
  const [quote, setQuote] = useState('');
  const [duration, setDuration] = useState('');
  const [contentFiles, setContentFiles] = useState([]);
  const [contentTypes, setContentTypes] = useState([]);
  const [stepNumbers, setStepNumbers] = useState([]);
  const [contentDescription, setContentDescription] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Use FormData to send course data and image file
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image); // include the image file
    formData.append("quote", quote);
    formData.append("duration", duration);

    const handleContentSubmit = async (courseId) => {
        const formData = new FormData();
        formData.append('course_id', courseId);

        contentFiles.forEach((file, index) => {
            formData.append('content[]', file);
            formData.append('step_number[]', stepNumbers[index]);
            formData.append('content_type[]', contentTypes[index]);
            formData.append('content_description[]', contentDescription[index]);
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
        } catch (err) {
            setError(err.response?.data?.message || "Error uploading content");
        }
      };
      setSuccess((prevSuccess) => prevSuccess + ` ${response.data.message}`);
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

    const handleContentDescriptionChange = (e, index) => {
        const updatedContentDescription = [...contentDescription];
        updatedContentDescription[index] = e.target.value;
        setContentDescription(updatedContentDescription);
    };

    return (
        <>
            {/* Sticky Navbar */}
            <Box sx={{ position: 'sticky', top: 0, zIndex: 1100 }}>
                <Navbar />
            </Box>

            {/* Enhanced Body Design */}
            <Container maxWidth="sm" sx={{ py: 5 }}>
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 4, 
                        borderRadius: 2, 
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%)' 
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography 
                            variant="h3" 
                            sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}
                        >
                            Upload Course
                        </Typography>
                        <Typography 
                            variant="h6" 
                            sx={{ color: '#555', fontStyle: 'italic' }}
                        >
                            "Share Your Knowledge with the World"
                        </Typography>
                    </Box>

                    {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <form onSubmit={handleCourseSubmit}>
                        <Box mb={3}>
                            <TextField
                                fullWidth
                                label="Title"
                                variant="outlined"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Box>

                        <Box mb={3}>
                            <TextField
                                fullWidth
                                label="Quote"
                                variant="outlined"
                                value={quote}
                                onChange={(e) => setQuote(e.target.value)}
                                required
                            />
                        </Box>

                        <Box mb={3}>
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

                        <Box mb={3}>
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

                        <Box mb={3}>
                            <TextField
                                fullWidth
                                label="Approximate Duration"
                                variant="outlined"
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                            />
                        </Box>

                        <Box mb={3}>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{
                                    backgroundColor: '#1976d2',
                                    '&:hover': { backgroundColor: '#115293' },
                                    py: 1,
                                    px: 3,
                                    borderRadius: 1,
                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                                }}
                            >
                                Select Course Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    hidden
                                    required
                                />
                            </Button>
                            {image && (
                                <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                                    {image.name}
                                </Typography>
                            )}
                        </Box>

                        <Typography 
                            variant="h5" 
                            sx={{ fontWeight: 'medium', color: '#333', mb: 2 }}
                        >
                            Upload Course Content
                        </Typography>

                        <Box mb={3}>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{
                                    backgroundColor: '#1976d2',
                                    '&:hover': { backgroundColor: '#115293' },
                                    py: 1,
                                    px: 3,
                                    borderRadius: 1,
                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                                }}
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
                            <Box key={index} mb={4} sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                                <Typography variant="body1" sx={{ color: '#333', mb: 2 }}>
                                    {file.name}
                                </Typography>

                                <Grid2 container spacing={2}>
                                    <Grid2 item xs={4}>
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
                                    </Grid2>

                                    <Grid2 item xs={4}>
                                        <TextField
                                            fullWidth
                                            label="Step Number"
                                            variant="outlined"
                                            type="number"
                                            value={stepNumbers[index] || ''}
                                            onChange={(e) => handleStepNumberChange(e, index)}
                                            required
                                        />
                                    </Grid2>

                                    <Grid2 item xs={4}>
                                        <TextField
                                            fullWidth
                                            label="Content Description"
                                            variant="outlined"
                                            type="text"
                                            value={contentDescription[index] || ''}
                                            onChange={(e) => handleContentDescriptionChange(e, index)}
                                            required
                                        />
                                    </Grid2>
                                </Grid2>
                            </Box>
                        ))}

                        <Button 
                            type="submit" 
                            variant="contained" 
                            fullWidth 
                            sx={{
                                backgroundColor: '#1976d2',
                                '&:hover': { backgroundColor: '#115293' },
                                py: 1.5,
                                borderRadius: 1,
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                            }}
                        >
                            Upload
                        </Button>
                    </form>
                </Paper>
            </Container>

            {/* Footer Added */}
            <Footer />
        </>
    );
};

export default UploadCourse;