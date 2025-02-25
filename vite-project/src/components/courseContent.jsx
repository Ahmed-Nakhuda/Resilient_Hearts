import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, CircularProgress, Alert, Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CourseContent = () => {
    const { courseId } = useParams();
    const [content, setContent] = useState([]);
    const [selectedContent, setSelectedContent] = useState(null);  // State to track selected content
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/view-course-content/${courseId}`);
                console.log('API Response:', response.data);

                if (response.data && response.data.length > 0) {
                    setContent(response.data);
                    setSelectedContent(response.data[0]);  // Default to show first content item
                } else {
                    setError('Course content not found');
                }
            } catch (err) {
                setError('Failed to load course details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    // Function to handle selecting content
    const handleContentClick = (item) => {
        setSelectedContent(item);
    };

    return (
        <Container sx={{ display: 'flex', mt: 3 }}>
            {/* Left: Accordion Menu */}
            <div style={{ width: '30%', marginRight: '20px' }}>
                {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
                {error && <Alert severity="error">{error}</Alert>}

                {content && content.length > 0 && (
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel-content"
                            id="panel-content-header"
                        >
                            <Typography>Course Steps</Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                            <List>
                                {content.map((item) => (
                                    <ListItem button key={item.content_id} onClick={() => handleContentClick(item)}>
                                        <ListItemText primary={`Step ${item.step_number}: ${item.content_type}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                )}
            </div>

            {/* Right: Main Content Display */}
            <Container maxWidth="md" sx={{ mt: 3, flex: 1 }}>
                {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
                {error && <Alert severity="error">{error}</Alert>}

                {selectedContent && (
                    <>
                        {selectedContent.content_type === 'video' && (
                            <video width="600" controls>
                                <source
                                    src={`http://localhost:3001/${selectedContent.content_url.replace(/\\/g, '/')}`}
                                    type="video/mp4"
                                />
                                Your browser does not support the video tag.
                            </video>
                        )}

                        {selectedContent.content_type === 'pdf' && (
                            <iframe
                                src={`http://localhost:3001/${selectedContent.content_url.replace(/\\/g, '/')}`}
                                width="100%"
                                height="600px"
                                title={`PDF Viewer - ${selectedContent.content_id}`}
                            />
                        )}
                    </>
                )}
            </Container>
        </Container>
    );
};

export default CourseContent;
