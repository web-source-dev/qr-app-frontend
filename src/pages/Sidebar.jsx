import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css'; // Import the external CSS file

const Sidebar = () => {
  const navigate = useNavigate();

  const handleMenuClick = (path) => {
    navigate(`/dashboard/${path}`);
  };

  return (
    <nav className="sidebar">
      <h3 className="sidebar-heading">Sidebar</h3>
      <ul className="sidebar-menu">
        {['generate', 'manage', 'settings', 'planspayments'].map((item) => (
          <li
            key={item}
            className="sidebar-menu-item"
            onClick={() => handleMenuClick(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
