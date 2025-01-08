import React from 'react';
import './AllThemecss/theme1.css';
import { RiFacebookFill, RiTwitterFill, RiLinkedinFill, RiYoutubeFill } from 'react-icons/ri';

const Theme1 = ({ user, theme, openModal }) => {
  const { backgroundColor, textColor, innerBoxColor, headingColor, linksColor } = theme;

  return (
    <div className="theme-1" style={{ backgroundColor, color: textColor }}>
      <div className="profile-card" style={{ backgroundColor: innerBoxColor, color: textColor }}>
        {/* Left Side: User Details */}
        <div className="profile-left">
          <img
            src={user.user_image}
            alt="User"
            className="profile-pic"
            onClick={() => openModal(user.user_image)}
            style={{ borderColor: linksColor }} // Add dynamic border color
          />
          <div className="name-after-the-image">
            <h2 style={{ color: headingColor }}>{user.name}</h2>
            <div className="email-box">
              <div className="email-box-left" style={{ backgroundColor }}>
                <i className="ri-mail-fill"></i>
              </div>
              <div className="email-box-right">
                <a href={`mailto:${user.email}`} style={{ color: linksColor }}>
                  {user.email}
                </a>
                <a href={`mailto:${user.work_email}`} style={{ color: linksColor }}>
                  {user.work_email}
                </a>
              </div>
            </div>
            <div className="email-box">
              <div className="email-box-left" style={{ backgroundColor }}>
                <i className="ri-phone-fill"></i>
              </div>
              <div className="email-box-right">
                <p>{user.phone}</p>
              </div>
            </div>
            <div className="email-box">
              <div className="email-box-left" style={{ backgroundColor }}>
                <i className="ri-map-pin-2-fill"></i>
              </div>
              <div className="email-box-right">
                <p>{user.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Social Links */}
        <div className="profile-right">
          <p><strong>Organization:</strong> {user.organization}</p>
          <p><strong>Social Links:</strong></p>
          <ul className="social-links">
            {user.youtube_url && (
              <li>
                <a href={user.youtube_url} style={{ color: linksColor }}><RiYoutubeFill size={24} /></a>
              </li>
            )}
            {user.facebook_url && (
              <li>
                <a href={user.facebook_url} style={{ color: linksColor }}><RiFacebookFill size={24} /></a>
              </li>
            )}
            {user.linkden_url && (
              <li>
                <a href={user.linkden_url} style={{ color: linksColor }}><RiLinkedinFill size={24} /></a>
              </li>
            )}
            {user.twitter_url && (
              <li>
                <a href={user.twitter_url} style={{ color: linksColor }}><RiTwitterFill size={24} /></a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Theme1;
