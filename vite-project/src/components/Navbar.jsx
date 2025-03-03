import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Navbar = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isFacilitator, setIsFacilitator] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get("http://localhost:3001/check-session", { withCredentials: true });
                if (response.data.role === "admin") {
                    setIsAdmin(true);
                }
                if (response.data.role === "enrolled") {
                    setIsEnrolled(true);
                }
                if (response.data.role === "facilitator") {
                    setIsFacilitator(true);
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

                    {(isEnrolled || isAdmin || isFacilitator) && (
                        <li><a href="/my-community">My Community</a></li>
                    )}
                </div>
              
                <div className="nav-right">
                    {(isEnrolled || isAdmin || isFacilitator) && (
                        <li>
                            <a href="/user-profile">
                                <img src="/images/avatar.png" width={50} height={50} alt="Avatar" />
                            </a>
                        </li>
                    )}

                </div>
            </ul>
        </nav>
    );
};

export default Navbar;
