import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Theme1 from '../AllThemes/Theme1';
import Theme2 from '../AllThemes/Theme2';
import Theme3 from '../AllThemes/Theme3';

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`);
        setUser(response.data.user);
        setTheme(response.data.theme);
        setErrorMessage('');
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setErrorMessage('User does not exist');
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
        setUser(null);
      }
    };

    fetchUser();
  }, [userId]);

  const openModal = (image) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage('');
  };

  const downloadVCard = () => {
    if (user) {
      const vCardData = `BEGIN:VCARD
      VERSION:3.0
      FN:${user.name}
      TEL:${user.phone || ''}
      EMAIL:${user.email || ''}
      ORG:${user.organization || ''}
      END:VCARD`;

      const blob = new Blob([vCardData], { type: 'text/vcard' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${user.name.replace(' ', '_')}_contact.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (errorMessage) {
    return <p className="error-message">{errorMessage}</p>;
  }

  if (!user || !theme) {
    return <p className="loading-message">Loading...</p>;
  }

  let ThemeComponent;
  switch (theme.theme_set) {
    case 'theme1':
      ThemeComponent = Theme1;
      break;
    case 'theme2':
      ThemeComponent = Theme2;
      break;
    case 'theme3':
      ThemeComponent = Theme3;
      break;
    default:
      ThemeComponent = Theme1; // Default theme if none matches
  }

  return (
    <div className="user-details-container-center">
      <ThemeComponent user={user} theme={theme} openModal={openModal} />

      <button className="save-contact-btns" onClick={downloadVCard}>Save</button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            <img src={modalImage} alt="Profile" width="400px" className="modal-image" />
            <button className="close-modal" onClick={closeModal}>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
