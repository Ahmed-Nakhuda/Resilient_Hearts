import { useEffect, useState } from 'react';
import axios from 'axios';

const Navbar = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isFacilitator, setIsFacilitator] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [profilePicture, setProfilePicture] = useState('/images/avatar.png'); // Default avatar image

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                // Fetch session data to check user role
                const response = await axios.get("http://localhost:3001/check-session", { withCredentials: true });
                console.log("Session Response:", response.data);  // Debugging line to check session response

                if (response.data.role === "admin") {
                    setIsAdmin(true);
                }
                if (response.data.role === "enrolled") {
                    setIsEnrolled(true);
                }
                if (response.data.role === "facilitator") {
                    setIsFacilitator(true);
                }

               // Fetch the user's profile picture using user_id from the session
               // const profileResponse = await axios.get(`http://localhost:3001/user/${response.data.user_id}`, { withCredentials: true });
                
               // console.log("Profile Response:", profileResponse.data);  // Debugging line to check the profile picture data

                // if (profileResponse.data.profile_picture) {
                //     setProfilePicture(profileResponse.data.profile_picture);  // Set the profile picture URL
                // } else {
                //     console.log("No profile picture set, using default.");
                //     setProfilePicture('/images/avatar.png');  // Use default if not set
                // }
            } catch (error) {
                console.error("Error fetching user role or profile:", error);
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
                                <img 
                                    src={profilePicture} 
                                    width={50} 
                                    height={50} 
                                    alt="Profile" 
                                    style={{ borderRadius: '50%' }} // Make it circular
                                />
                            </a>
                        </li>
                    )}
                </div>
            </ul>
        </nav>
    );
};

export default Navbar;
