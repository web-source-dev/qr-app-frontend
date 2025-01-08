import React from 'react';

const Theme2 = ({ user, theme, openModal }) => {
  return (
    <div style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }} className="theme-2">
      <div className="profile-container">
        <div className="profile-main">
          <img
            src={user.user_image}
            alt="User"
            className="profile-img"
            onClick={() => openModal(user.user_image)}
          />
          <h2 style={{ color: theme.headingColor }}>{user.name}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Work Email:</strong> {user.work_email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address}</p>
        </div>

        <div className="profile-sidebar">
          <p><strong>Organization:</strong> {user.organization}</p>
          <h3 style={{ color: theme.headingColor }}>Social Links</h3>
          <ul className="social-links">
            <li><a href={user.youtube_url} style={{ color: theme.linksColor }}>YouTube</a></li>
            <li><a href={user.facebook_url} style={{ color: theme.linksColor }}>Facebook</a></li>
            <li><a href={user.linkden_url} style={{ color: theme.linksColor }}>LinkedIn</a></li>
            <li><a href={user.twitter_url} style={{ color: theme.linksColor }}>Twitter</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Theme2;
