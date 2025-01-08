import React from "react";
import "./Page404.css"; // CSS file for styling

const Page404 = () => {
  return (
    <div className="page404-container">
      <div className="page404-content">
        <h1 className="page404-title">404</h1>
        <h2 className="page404-subtitle">Page Not Found</h2>
        <p className="page404-message">
          The page you're looking for does not exist.
        </p>
        <p className="page404-suggestion">
          Please check the URL or go back to the home page.
        </p>
        <a href="/dashboard" className="page404-button">
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default Page404;
