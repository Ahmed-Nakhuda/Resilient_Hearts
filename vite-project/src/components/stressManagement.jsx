import React from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button'
import { useParams } from 'react-router-dom';


const StressManagement = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();

    // Navigate to payment page
    const navigateToPayment = (courseId) => {
        navigate(`/payment/${courseId}`);
    };

    return (
        <>
            <h1>Stress Management</h1>
            <Button onClick={() => navigateToPayment(courseId)} variant='contained'>Enroll</Button>
        </>
    )
}

export default StressManagement