import React from 'react'
import { TextField, Button } from '@mui/material'

const MyCommunity = () => {
  return (
    <div>
        <h1>My Community</h1>

        <TextField
            label="write something here"
            variant="outlined"
            margin="normal"
        />

        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Post
        </Button>
        
    </div>
  )
}

export default MyCommunity