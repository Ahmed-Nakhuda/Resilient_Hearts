import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material'
import Navbar from './Navbar'

const JoinMeeting = () => {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get('https://resilient-hearts-api-hceyatazggfahhcp.canadacentral-01.azurewebsites.net/get-meetings')
        setMeetings(response.data)
      } catch (error) {
        console.error('Error fetching meetings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMeetings()
  }, [])

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, px: 2 }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Upcoming Meetings
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : meetings.length === 0 ? (
          <Typography variant="h6">No meetings available at this moment.</Typography>
        ) : (
          meetings
            .filter(meeting => new Date(meeting.meeting_time) > new Date()) // Only future meetings
            .map((meeting) => (
              <Card key={meeting.id} sx={{ mb: 3, p: 2 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {meeting.title}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, fontSize: '1.1rem' }}>
                    {meeting.description}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                    Time: {new Date(meeting.meeting_time).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                    Duration: {meeting.duration} minutes
                  </Typography>
                  <Typography
                    component="a"
                    href={meeting.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'block',
                      mt: 2,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: 'primary.main',
                      textDecoration: 'underline',
                    }}
                  >
                    Join Link
                  </Typography>
                </CardContent>
              </Card>
            ))
        )}
      </Box>
    </>
  )
}

export default JoinMeeting
