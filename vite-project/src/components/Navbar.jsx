import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Fade,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { keyframes } from '@emotion/react';

// Keyframe for glowing effect
const glow = keyframes`
    0% { box-shadow: 0 0 5px #42a5f5, 0 0 10px #42a5f5, 0 0 15px #42a5f5; }
    50% { box-shadow: 0 0 10px #42a5f5, 0 0 20px #42a5f5, 0 0 30px #42a5f5; }
    100% { box-shadow: 0 0 5px #42a5f5, 0 0 10px #42a5f5, 0 0 15px #42a5f5; }
`;

// Keyframe for gradient animation
const gradientShift = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

const Navbar = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isFacilitator, setIsFacilitator] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [profilePicture, setProfilePicture] = useState('/images/avatar.png');
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get("http://localhost:3001/check-session", { withCredentials: true });
                console.log("Session Response:", response.data);

                if (response.data.role === "admin") setIsAdmin(true);
                if (response.data.role === "enrolled") setIsEnrolled(true);
                if (response.data.role === "facilitator") setIsFacilitator(true);

                // Uncomment and adjust this section if profile picture fetching is implemented
                // const profileResponse = await axios.get(`http://localhost:3001/user/${response.data.user_id}`, { withCredentials: true });
                // if (profileResponse.data.profile_picture) {
                //     setProfilePicture(profileResponse.data.profile_picture);
                // }
            } catch (error) {
                console.error("Error fetching user role or profile:", error);
            }
        };
        fetchUserRole();
    }, []);

    // Profile menu handlers
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    // Mobile drawer handlers
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    // Navigation handler
    const handleNavigate = (path) => {
        navigate(path);
        setMobileOpen(false);
        handleMenuClose();
    };

    // Logout handler (adjust endpoint if needed)
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3001/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                window.location.replace('/'); // Redirect to home page

              } else {
                console.error("Error logging out:");
              }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    // Drawer content for mobile
    const drawerContent = (
        <Box sx={{ width: 250, p: 2, background: 'linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%)', height: '100%' }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', mb: 2, textAlign: 'center', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)' }}>
                Navigation
            </Typography>
            <Divider sx={{ bgcolor: '#fff', mb: 2 }} />
            <List>
                <ListItem button onClick={() => handleNavigate('/')} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', animation: `${glow} 1.5s infinite` } }}>
                    <ListItemText primary="Home" sx={{ color: '#fff', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }} />
                </ListItem>
                {(!isEnrolled || !isAdmin || !isFacilitator) && (
                    <ListItem button onClick={() => handleNavigate('/login')} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', animation: `${glow} 1.5s infinite` } }}>
                        <ListItemText primary="Login" sx={{ color: '#fff', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }} />
                    </ListItem>
                )}
                <ListItem button onClick={() => handleNavigate('/user-courses')} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', animation: `${glow} 1.5s infinite` } }}>
                    <ListItemText primary="My Courses" sx={{ color: '#fff', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }} />
                </ListItem>
                {isAdmin && (
                    <>
                        <ListItem button onClick={() => handleNavigate('/upload-course')} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', animation: `${glow} 1.5s infinite` } }}>
                            <ListItemText primary="Upload Course" sx={{ color: '#fff', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }} />
                        </ListItem>
                        <ListItem button onClick={() => handleNavigate('/remove-course')} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', animation: `${glow} 1.5s infinite` } }}>
                            <ListItemText primary="Remove Course" sx={{ color: '#fff', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }} />
                        </ListItem>
                    </>
                )}
                {(isEnrolled || isAdmin || isFacilitator) && (
                    <ListItem button onClick={() => handleNavigate('/my-community')} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', animation: `${glow} 1.5s infinite` } }}>
                        <ListItemText primary="My Community" sx={{ color: '#fff', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }} />
                    </ListItem>
                )}
                {(isEnrolled || isAdmin) && (
                    <ListItem button onClick={() => handleNavigate('/message-facilitator')} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', animation: `${glow} 1.5s infinite` } }}>
                        <ListItemText primary="Message Facilitator" sx={{ color: '#fff', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }} />
                    </ListItem>
                )}
                {(isFacilitator) && (
                    <ListItem button onClick={() => handleNavigate('/facilitator-messages')} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', animation: `${glow} 1.5s infinite` } }}>
                        <ListItemText primary="Facilitator Messages" sx={{ color: '#fff', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }} />
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <AppBar 
            position="sticky" 
            sx={{ 
                background: 'linear-gradient(90deg, #1e88e5 0%, #42a5f5 50%, #1e88e5 100%)',
                backgroundSize: '200% 200%',
                animation: `${gradientShift} 8s ease infinite`,
                boxShadow: '0 4px 25px rgba(0, 0, 0, 0.4)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5 }}>
                {/* Left Section (nav-left) */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton 
                        onClick={() => handleNavigate('/')} 
                        sx={{ 
                            '&:hover': { transform: 'scale(1.15)', animation: `${glow} 1.5s infinite` },
                            transition: 'transform 0.3s',
                            p: 0
                        }}
                    >
                        <img 
                            src="/src/assets/icon.png" 
                            alt="Home" 
                            style={{ 
                                width: 50, 
                                height: 50, 
                                borderRadius: '50%', 
                                border: '2px solid #fff',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                            }} 
                        />
                    </IconButton>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5 }}>
                        <Button 
                            onClick={() => handleNavigate('/login')} 
                            sx={{ 
                                color: '#fff', 
                                fontWeight: 'bold', 
                                textTransform: 'none',
                                px: 2.5,
                                py: 1,
                                borderRadius: 10,
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                '&:hover': { 
                                    background: 'rgba(255, 255, 255, 0.25)', 
                                    transform: 'scale(1.05)', 
                                    animation: `${glow} 1.5s infinite`,
                                    transition: 'all 0.3s'
                                }
                            }}
                        >
                            Login
                        </Button>
                        <Button 
                            onClick={() => handleNavigate('/user-courses')} 
                            sx={{ 
                                color: '#fff', 
                                fontWeight: 'bold', 
                                textTransform: 'none',
                                px: 2.5,
                                py: 1,
                                borderRadius: 10,
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                '&:hover': { 
                                    background: 'rgba(255, 255, 255, 0.25)', 
                                    transform: 'scale(1.05)', 
                                    animation: `${glow} 1.5s infinite`,
                                    transition: 'all 0.3s'
                                }
                            }}
                        >
                            My Courses
                        </Button>
                        {isAdmin && (
                            <>
                                <Button 
                                    onClick={() => handleNavigate('/upload-course')} 
                                    sx={{ 
                                        color: '#fff', 
                                        fontWeight: 'bold', 
                                        textTransform: 'none',
                                        px: 2.5,
                                        py: 1,
                                        borderRadius: 10,
                                        background: 'rgba(255, 255, 255, 0.15)',
                                        backdropFilter: 'blur(5px)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        '&:hover': { 
                                            background: 'rgba(255, 255, 255, 0.25)', 
                                            transform: 'scale(1.05)', 
                                            animation: `${glow} 1.5s infinite`,
                                            transition: 'all 0.3s'
                                        }
                                    }}
                                >
                                    Upload Course
                                </Button>
                                <Button 
                                    onClick={() => handleNavigate('/remove-course')} 
                                    sx={{ 
                                        color: '#fff', 
                                        fontWeight: 'bold', 
                                        textTransform: 'none',
                                        px: 2.5,
                                        py: 1,
                                        borderRadius: 10,
                                        background: 'rgba(255, 255, 255, 0.15)',
                                        backdropFilter: 'blur(5px)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        '&:hover': { 
                                            background: 'rgba(255, 255, 255, 0.25)', 
                                            transform: 'scale(1.05)', 
                                            animation: `${glow} 1.5s infinite`,
                                            transition: 'all 0.3s'
                                        }
                                    }}
                                >
                                    Remove Course
                                </Button>
                            </>
                        )}
                        {(isEnrolled || isAdmin || isFacilitator) && (
                            <Button 
                                onClick={() => handleNavigate('/my-community')} 
                                sx={{ 
                                    color: '#fff', 
                                    fontWeight: 'bold', 
                                    textTransform: 'none',
                                    px: 2.5,
                                    py: 1,
                                    borderRadius: 10,
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    backdropFilter: 'blur(5px)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    '&:hover': { 
                                        background: 'rgba(255, 255, 255, 0.25)', 
                                        transform: 'scale(1.05)', 
                                        animation: `${glow} 1.5s infinite`,
                                        transition: 'all 0.3s'
                                    }
                                }}
                            >
                                My Community
                            </Button>
                        )}
                        {(isEnrolled || isAdmin) && (
                            <Button 
                                onClick={() => handleNavigate('/message-facilitator')} 
                                sx={{ 
                                    color: '#fff', 
                                    fontWeight: 'bold', 
                                    textTransform: 'none',
                                    px: 2.5,
                                    py: 1,
                                    borderRadius: 10,
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    backdropFilter: 'blur(5px)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    '&:hover': { 
                                        background: 'rgba(255, 255, 255, 0.25)', 
                                        transform: 'scale(1.05)', 
                                        animation: `${glow} 1.5s infinite`,
                                        transition: 'all 0.3s'
                                    }
                                }}
                            >
                                Message Facilitator
                            </Button>
                        )}
                        {(isFacilitator) && (
                            <Button 
                                onClick={() => handleNavigate('/facilitator-messages')} 
                                sx={{ 
                                    color: '#fff', 
                                    fontWeight: 'bold', 
                                    textTransform: 'none',
                                    px: 2.5,
                                    py: 1,
                                    borderRadius: 10,
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    backdropFilter: 'blur(5px)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    '&:hover': { 
                                        background: 'rgba(255, 255, 255, 0.25)', 
                                        transform: 'scale(1.05)', 
                                        animation: `${glow} 1.5s infinite`,
                                        transition: 'all 0.3s'
                                    }
                                }}
                            >
                                Facilitator Messages
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Right Section (nav-right) */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {(isEnrolled || isAdmin || isFacilitator) && (
                        <>
                            <IconButton 
                                onClick={handleMenuOpen} 
                                sx={{ 
                                    '&:hover': { transform: 'scale(1.15)', animation: `${glow} 1.5s infinite` },
                                    transition: 'transform 0.3s',
                                    p: 0
                                }}
                            >
                                <Avatar 
                                    src={profilePicture} 
                                    alt="Profile" 
                                    sx={{ 
                                        width: 50, 
                                        height: 50, 
                                        border: '2px solid #fff',
                                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                                    }} 
                                />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                TransitionComponent={Fade}
                                sx={{ 
                                    mt: 1,
                                    '& .MuiPaper-root': {
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                                    }
                                }}
                            >
                                <MenuItem 
                                    onClick={() => handleNavigate('/user-profile')}
                                    sx={{ 
                                        '&:hover': { bgcolor: 'rgba(66, 165, 245, 0.1)', color: '#1e88e5' },
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    Profile
                                </MenuItem>
                                <MenuItem 
                                    onClick={handleLogout}
                                    sx={{ 
                                        '&:hover': { bgcolor: 'rgba(66, 165, 245, 0.1)', color: '#1e88e5' },
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                    <IconButton
                        color="inherit"
                        edge="end"
                        onClick={handleDrawerToggle}
                        sx={{ display: { md: 'none' }, ml: 2 }}
                    >
                        <MenuIcon sx={{ color: '#fff', fontSize: 32, '&:hover': { animation: `${glow} 1.5s infinite` } }} />
                    </IconButton>
                </Box>
            </Toolbar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{ '& .MuiDrawer-paper': { boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' } }}
            >
                {drawerContent}
            </Drawer>
        </AppBar>
    );
};

export default Navbar;