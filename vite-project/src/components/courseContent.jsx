import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, CircularProgress, Alert, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Navbar from './Navbar';
import "../stylesheets/courseContent.css";


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
                    // Sort by step_number before setting state
                    const sortedContent = response.data.sort((a, b) => a.step_number - b.step_number);
                    setContent(sortedContent);
                    setSelectedContent(sortedContent[0]);  // Default to first content item
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
        <>
            <Navbar/>
            <div style={{ display: "flex" }}>
                <div style={{ width: '30%', margin: '1rem' }}>
                    {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
                    {error && <Alert severity="error">{error}</Alert>}

                    {content.length > 0 && (
                        <Accordion expanded={true}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel-content"
                                id="panel-content-header"
                            >
                                <Typography>Content</Typography>
                            </AccordionSummary>

                            <AccordionDetails sx={{ display: 'block' }}>
                                <div className="content-left" style={{ display: 'flex', flexDirection: 'column',  }}>
                                    {content.map((item) => (
                                        <div
                                            key={item.content_id}
                                            style={{ display: 'flex', alignItems: 'center', padding: '8px', cursor: 'pointer', borderRadius: '10px' }}
                                            onClick={() => handleContentClick(item)}
                                        >
                                            {/* Circle next to the content description */}
                                            <div
                                                style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    borderRadius: '50%',
                                                    backgroundColor: selectedContent?.content_id === item.content_id ? 'blue' : 'gray',
                                                    marginRight: '8px',
                                                }}
                                            />
                                            <Typography variant="body1">{`${item.content_description}`}</Typography>
                                        </div>
                                    ))}
                                </div>
                            </AccordionDetails>
                        </Accordion>
                    )}
                </div>

                {/* Right: Main Content Display */}
                <div style={{ flex: 1, margin: '1rem 1rem 1rem 0' }}>
                    {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
                    {error && <Alert severity="error">{error}</Alert>}

                    {selectedContent && (
                        <>
                            {selectedContent.content_type === 'video' && (
                                <video width="100%" controls>
                                    <source src={selectedContent.content_url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}

                            {selectedContent.content_type === 'pdf' && (
                                <iframe
                                    src={`${selectedContent.content_url}?fl_attachment`} // Forces direct download
                                    width="100%"
                                    height="600px"
                                    title={`PDF Viewer - ${selectedContent.content_id}`}
                                />
                            )}


                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default CourseContent;