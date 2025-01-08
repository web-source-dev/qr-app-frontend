import React, { useEffect, useState } from 'react';
import './Sidebar.css'; // Import external CSS
import AllQrCodeCall from '../Dashboard/UserDashboard/allcomponentsCall/allqrcodecall/AllQrCodeCall';
import Allmygeneratedheader from '../Dashboard/UserDashboard/allcomponentsCall/allgeneratedqrcodescall/myqrCode/allmygeneratedheader';
import CreditsSelection from '../payments/CreditSelection';
import Settings from '../Dashboard/UserDashboard/Settings/Settings';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Sidebar = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('MyQRCodes');
  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    if (!user_id) {
      navigate('/user/login')
    }
  },[])

  const menuItems = [
    { id: 'GenerateQR', label: 'Generate QR Code' },
    { id: 'MyQRCodes', label: 'My QR Codes' },
    { id: 'Settings', label: 'Settings' },
    { id: 'PlansPayments', label: 'Plans & Payments' },
  ];
  
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
    <div className="sidebar-container">
      {/* Sidebar */}
      <div className="sidebar">
        <nav>
          <ul>  
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={selected === item.id ? 'menu-item active' : 'menu-item'}
                onClick={() => setSelected(item.id)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="content">
   
        {selected === 'GenerateQR' &&
        <AllQrCodeCall />
        }
        {selected === 'MyQRCodes' &&
        <Allmygeneratedheader />
        }
        {selected === 'Settings' &&
        <Settings />
        }
        {selected === 'PlansPayments' &&
        <CreditsSelection />
        }
      </div>
    </div>
  );
};

export default Sidebar;
