import React, { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import Navbar from './Navbar'
import axios from 'axios'

const UploadMeeting = () => {
    const [title, setTitle] = useState('')
    const [link, setLink] = useState('')
    const [description, setDescription] = useState('')
    const [time, setTime] = useState('')
    const [duration, setDuration] = useState('')


    // Inside your component
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post('http://localhost:3001/upload-meeting', {
                title,
                link,
                description,
                time, 
                duration
            })

            alert(response.data.message)

            // Clear the form
            setTitle('')
            setLink('')
            setDescription('')
            setTime('')
            setDuration('')
        } catch (error) {
            console.error('Error uploading meeting:', error)
            const msg =
                error.response?.data?.message || 'Something went wrong. Please try again.'
            alert(msg)
        }
    }


    return (
        <>
            <Navbar />
            <Box
                sx={{
                    maxWidth: 500,
                    margin: 'auto',
                    mt: 5,
                    p: 4,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: '#f9f9f9'
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Upload a Meeting
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Title"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <TextField
                        label="Meeting Link"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        required
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <TextField
                        label="Duration (minutes)"
                        type="number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        inputProps={{ min: 1 }}
                        required
                    />
                    <TextField
                        label="Meeting Time"
                        type="datetime-local"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Upload
                    </Button>
                </form>
            </Box>
        </>
    )
}

export default UploadMeeting
