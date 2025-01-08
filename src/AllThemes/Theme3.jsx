import React from 'react';

const Theme3 = ({ user, theme, openModal }) => {
  return (
    <div style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }} className="theme-3">
      <div className="profile-table">
        <div className="profile-top">
          <img
            src={user.user_image}
            alt="User"
            className="profile-img"
            onClick={() => openModal(user.user_image)}
          />
          <h2 style={{ color: theme.headingColor }}>{user.name}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address}</p>
        </div>

        <div className="tabs">
          <div className="tab">
            <h3 style={{ color: theme.headingColor }}>Organization</h3>
            <p>{user.organization}</p>
          </div>
          <div className="tab">
            <h3 style={{ color: theme.headingColor }}>Social Media</h3>
            <ul className="social-links">
              <li><a href={user.youtube_url} style={{ color: theme.linksColor }}>YouTube</a></li>
              <li><a href={user.facebook_url} style={{ color: theme.linksColor }}>Facebook</a></li>
              <li><a href={user.linkden_url} style={{ color: theme.linksColor }}>LinkedIn</a></li>
              <li><a href={user.twitter_url} style={{ color: theme.linksColor }}>Twitter</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Theme3;
