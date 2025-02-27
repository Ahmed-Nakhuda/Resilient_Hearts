import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Navbar = () => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get("http://localhost:3001/check-session", { withCredentials: true });
                if (response.data.role === "admin") {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
            }
        };

        fetchUserRole();
    }, []);

    return (
        <nav>
            <ul>
                <div className="nav-left">
                    <li><a href="/login">Login</a></li>
                    <li><a href='/'>Home</a></li>
                    <li><a href="/user-courses">My Courses</a></li>
                    {isAdmin && <li><a href="/upload-course">Upload Course</a></li>}
                </div>
                <div className="nav-right">
                    <li><img src="/images/avatar.png" width={50} height={50} alt="Avatar" /></li>
                </div>
            </ul>
        </nav>
    );
};

export default Navbar;
