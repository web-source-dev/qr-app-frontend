import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'

import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const user_token = localStorage.getItem('user_token');
    
  const handleLogout = async () => {
    console.log('logout');
  
    try {
      const user_id = localStorage.getItem('user_id');
      const logoutResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/logout`, { userId: user_id });
  
      if (logoutResponse.status === 200) {
        localStorage.clear();
        navigate('/user/login')
      }
    } catch (error) {
      console.error(error);
    }
  
    console.log('Logged out');
  };
  
  return (
   
       <>
       <div className="navbar-of-users-pages">
        <div className="left-side-of-nav-bar-for-logo">
            <img src="https://marketplace.canva.com/EAF0Hq4UHjM/1/0/1600w/canva-orange-phoenix-animal-gaming-logo-WIPEOAyYPIs.jpg" width="50px" alt="" />
        </div>
        <div className="middle-of-nav-bar-for-links">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/help">Help</a>
        </div>
        <div className="right-side-of-nav-bar-for-profile-dropdown">
            {user_token ? (
                <div className="actions-to-view-profile">
                    <button  className="btn-18" style={{backgroundColor:"white"}}> <span> Profile</span></button>
                    <button onClick={handleLogout}  className="btn-18" style={{backgroundColor:"white"}}> <span> logout</span></button>
                </div>
            ):(
                <div className="login-signup-links">
                    <button onClick={()=> navigate('/user/login')}  className="btn-18" style={{backgroundColor:"white"}}> <span> Login</span></button>
                    <button onClick={()=> navigate('/user/signup')} className="btn-18" style={{backgroundColor:"white"}}> <span> SignUp</span></button>
                </div>
            )
            }
        </div>
       </div>
       </>
  )
}

export default Navbar;
