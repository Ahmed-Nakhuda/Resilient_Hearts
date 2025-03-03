import React from 'react'
import { Button, Input, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';


const UserProfile = () => {
    return (
        <>
        <Navbar/>
            <div>
                <h1>User Profile</h1>
                <p>Upload profile picture</p>
                <Input type="file"></Input>
            </div>
        </>
    )
}

export default UserProfile