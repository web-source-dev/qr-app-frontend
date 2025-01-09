import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import QRForm from './Components/QRForm';
import ViewData from './Components/ViewData';
import UserDetails from './Components/UserDetails';
import EditQRForm from './Components/QrEditForm';
import UserLogin from './Userlogin/UserLogin';
import UserSignup from './Userlogin/UserSignup';
import axios from 'axios';
import Home from './pages/Home';
// import Urlqr from './allqrcodefiles/urlqr/urlqr';
// import Wifiqr from './allqrcodefiles/wifiqr/wifiqr';
// import MessageQR from './allqrcodefiles/messageqr/messageqr';
// import Smsqr from './allqrcodefiles/smsqr/smsqr';
// import EmailQrGenerator from './allqrcodefiles/emailsendqr/emailsendqr';
// import WhatsAppQrGenerator from './allqrcodefiles/whatsappqrmsg/whatsappqrmsg';
// import VcardCreate from './allqrcodefiles/vcardqr/vcardcreateqr';
import VcardShowqrData from './allqrcodefiles/vcardqr/vcarddisplayqrdata';
// import InstagramQr from './allqrcodefiles/instagramaccountqr/instagramaccounqr';
// import FacebookQr from './allqrcodefiles/facebookaccountqr/facebookaccountqr';
// import SocialProfile from './allqrcodefiles/socialprofile/SocialProfile';
import SocialProfileDisplay from './allqrcodefiles/socialprofile/SoicalProfileView';
// import BusinessForm from './allqrcodefiles/businesscsvqr/BusinessCsvqr';
import { GlobalConfigProvider } from './allqrcodefiles/stats/configuration/globalconfig';
import { CustomizationProvider } from './allqrcodeCustomizations/designCustomization/globalcustomization';
import { QRProvider } from './allqrcodeCustomizations/qrCodeCustomization/globalqrcodedesign';
import PaymentWrapper from './payments/PaymentReceive';
import { PaymentProvider } from './payments/PaymentContext';
import ThankYouPage from './payments/ThankYouPage';
import DisplayBusinessData from './allqrcodefiles/businesscsvqr/displaybusinessdata';
import { FormProvider } from './allqrcodeCustomizations/globalsetup/globaldata';
import DisplaySocialData from './allqrcodefiles/socialprofile/DisplaySocialdata';
import AfterScanDisplayShopMenu from './allqrcodefiles/ShopMenuCard/AfterScandisplayShopmenu';
import { GlobalLocalProvider } from './allqrcodeCustomizations/globallocalqr/GlobalLocalQr';
import Navbar from './pages/Navbar';
import DisplayImages from './allqrcodefiles/Imagesqr/DisplayImagesQr';
import MusicDisplay from './allqrcodefiles/MusicQR/MobileMusicDisplay';
import DisplaylandingPage from './allqrcodefiles/LandingPage/DisplayLandingPage';
import Dashboard from './Dashboard/UserDashboard/DashboardMain';


const AppContent = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const location = useLocation();  // Now inside the Router

  // Trigger loading when route changes
  useEffect(() => {
    setLoading(true); // Show loading screen when route changes
    const timer = setTimeout(() => {
      setLoading(false); // Hide loading screen after a delay
    }, 10); // Set to 1 second or however long you want the loading screen to appear

    // Cleanup the timer if the component unmounts or location changes
    return () => clearTimeout(timer);
  }, [location]);  // This effect runs every time the location (route) changes


  useEffect(() => {
    const checkUserToken = async () => {
      const userToken = localStorage.getItem('user_token');  // Get the token from localStorage
      if (!userToken) return;

      try {
        // Send token in the request body
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/checkuserapi`, { UserToken: userToken });

        // Access the response data (axios automatically parses JSON)
        console.log(response);
        const resData = response.data;

        if (resData.tokensts === 1) {
          // Token is invalid or expired, clear localStorage and redirect
          localStorage.clear();
          navigate('/user/login');
        }
      } catch (error) {
        console.error("User token verification error:", error);
        localStorage.clear();  // Clear localStorage in case of error
        navigate('/user/login');  // Redirect to login page on error
      }
    };
    setTimeout(() => {
      localStorage.removeItem('businessdatasending')
      localStorage.removeItem('configuration')
      localStorage.removeItem('customization')
      localStorage.removeItem('qrDesign')
      const remove = localStorage.getItem('requestBusinessEdit')

      console.log("LocalStorage cleared after 3 minutes.");
      if(remove){
        localStorage.removeItem('requestBusinessEdit')
      navigate('/dashboard')
      }
    }, 1200000); // 3 minutes in milliseconds

  // Call this function on page load
  
    checkUserToken();
  }, [navigate]);
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <h2>Loading...</h2>
      </div>
    );
  }

  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  return (
    <div>
      <PaymentProvider >
       <GlobalConfigProvider>
        <QRProvider>
       <CustomizationProvider>
        <FormProvider >
          <GlobalLocalProvider>
            <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/qrform" element={<QRForm />} />
        <Route path="/data" element={<ViewData />} />
        <Route path="/user/:userId" element={<UserDetails />} />
        <Route path="/edit/:userId" element={<EditQRForm />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/vcard/:id" element={<VcardShowqrData />} />
        <Route path="/qr/payment" element={<PaymentWrapper />} />
        <Route path="/success" element={<ThankYouPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/qr/socialprofile/:qrId" element={<SocialProfileDisplay />} />
        <Route path="display/qr-business/:qrId" element={<DisplayBusinessData />} />
        <Route path="display/qr-social/:qrId" element={<DisplaySocialData />} />
        <Route path="display/qr-shopmenu/:qrId" element={<AfterScanDisplayShopMenu />} />
        <Route path="display/qr-landingpage/:qrId" element={<DisplaylandingPage />} />
        <Route path="display/qr-images/:qrId" element={<DisplayImages />} />
        <Route path="display/qr-video/:qrId" element={<DisplayImages />} />
        <Route path="display/qr-music/:qrId" element={<MusicDisplay />} />
        {/* <Route path="*" element={<Page404 />} /> */}
      </Routes>
      </GlobalLocalProvider>
      </FormProvider>
      </CustomizationProvider>
      </QRProvider>
      </GlobalConfigProvider>
      </PaymentProvider>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent /> {/* AppContent is now wrapped by Router */}
    </Router>
  );
};

export default App;
