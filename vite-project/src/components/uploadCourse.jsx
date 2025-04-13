import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Grid2, InputLabel, MenuItem, Select, FormControl, FormHelperText } from '@mui/material';
import Navbar from './Navbar';

const UploadCourse = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [image, setImage] = useState(null);
    const [quote, setQuote] = useState('');
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
        formData.append("duration", duration); // include the duration
        formData.append("quote", quote); // include the quote

        try {
            const response = await axios.post(
                "http://localhost:3001/upload-course",
                formData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setSuccess(response.data.message);
            const courseId = response.data.courseId;
            handleContentSubmit(courseId);
        } catch (err) {
            setError(err.response?.data?.message || "Error uploading course");
        }
    };

    const handleContentSubmit = async (courseId) => {
        const formData = new FormData();
        formData.append('course_id', courseId);

        contentFiles.forEach((file, index) => {
            formData.append('content[]', file);
            formData.append('step_number[]', stepNumbers[index]);
            formData.append('content_type[]', contentTypes[index]);
            formData.append('content_description[]', contentDescription[index]); // Send content description as an array
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
            <Navbar />
            <Container maxWidth="sm">
                <Typography variant="h4" marginTop={5} gutterBottom>
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
                            label="Quote"
                            variant="outlined"
                            multiline
                            rows={4}
                            value={quote}
                            onChange={(e) => setQuote(e.target.value)}
                            required
                        />
                    </Box>

                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Duration"
                            variant="outlined"
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
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

                    {/* Image Upload Input */}
                    <Box mb={2}>
                        <Button
                            variant="contained"
                            component="label"
                            color="primary"
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
                        {/* display the name of the image uploaded */}
                        {image && <Typography variant="body2">{image.name}</Typography>}
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

                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Upload
                    </Button>
                </form>
            </Container>
        </>
    );
};

export default UploadCourse;