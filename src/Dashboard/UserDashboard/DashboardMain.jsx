// Dashboard.js
import React, { useEffect } from 'react';
import { Routes, Route,useLocation , useNavigate } from 'react-router-dom';
import Sidebar from '../../pages/Sidebar';
import Settings from './Settings/Settings';
import PlansPayments from './Settings/PlanPayments';
import AllQrCodeCall from './allcomponentsCall/allqrcodecall/AllQrCodeCall';
import ImagesQr from '../../allqrcodefiles/Imagesqr/ImagesQr';
import VideoQr from '../../allqrcodefiles/VideoQr/VideoQr';
import MusicQr from '../../allqrcodefiles/MusicQR/MusicQR';
import LandingPageQr from '../../allqrcodefiles/LandingPage/LandingPage';
import CoupanQR from '../../allqrcodefiles/CoupanQr/CoupanQr';
import PdfQr from '../../allqrcodefiles/PdfQr/PdfQr';
import AppQr from '../../allqrcodefiles/AppQr/AppQr';
import ListOfLinksQr from '../../allqrcodefiles/ListOfLinks/ListofLinks';
import ShopMenuForm from '../../allqrcodefiles/ShopMenuCard/ShopMenu';
import SocialProfile from '../../allqrcodefiles/socialprofile/SocialProfile';
import TimeScheduleForm from '../../allqrcodefiles/businesscsvqr/BusinessCsvqr';
import Urlqr from '../../allqrcodefiles/urlqr/urlqr';
import Wifiqr from '../../allqrcodefiles/wifiqr/wifiqr';
import MessageQr from '../../allqrcodefiles/messageqr/messageqr';
import Smsqr from '../../allqrcodefiles/smsqr/smsqr';
import EmailQrGenerator from '../../allqrcodefiles/emailsendqr/emailsendqr';
import VcardCreate from '../../allqrcodefiles/vcardqr/vcardcreateqr';
import InstagramQr from '../../allqrcodefiles/instagramaccountqr/instagramaccounqr';
import FacebookQr from '../../allqrcodefiles/facebookaccountqr/facebookaccountqr';
import WhatsAppQrGenerator from '../../allqrcodefiles/whatsappqrmsg/whatsappqrmsg';
import VcardPlusQR from '../../allqrcodefiles/VcardPlusQr/VcardPlusQr';
import ProductQr from '../../allqrcodefiles/ProductQr/ProductQr';
import EventQrForm from '../../allqrcodefiles/EventQr/EventQr';
import BarcodeGenerator from '../../allqrcodefiles/Barcode/Barcode';
import AllMyGeneratedHeader from './allcomponentsCall/allgeneratedqrcodescall/myqrCode/allmygeneratedheader';



const Dashboard = () => {
  const location = useLocation();

  useEffect(()=> {
    const notremove = localStorage.getItem('url')
    if (location.pathname + location.search === notremove) {
      console.log('Right path, localStorage retained');
    } 
    else{
      
    localStorage.removeItem('businessdatasending')
    localStorage.removeItem('configuration')
    localStorage.removeItem('customization')
    localStorage.removeItem('qrDesign')
    localStorage.removeItem('url')
    const remove = localStorage.getItem('requestBusinessEdit')
    

    console.log("LocalStorage cleared after 3 minutes.");
    if(remove){
      localStorage.removeItem('requestBusinessEdit')
    }

    }
  }, [location.pathname]);

  return (
    <div style={{ display: 'flex', height:'90vh' }}>
      {/* Static Sidebar */}
      <Sidebar />
      

      {/* Main Content that changes based on the URL */}
      <div style={{ flex: 1, overflow:'auto'}}>
        <Routes>
          
          {/* sidebar */}

          <Route path="generate" element={<AllQrCodeCall />} />
          <Route path="manage" element={<AllMyGeneratedHeader />} />
          <Route path="settings" element={<Settings />} />
          <Route path="planspayments" element={<PlansPayments />} />



          {/* dynamic */}
        <Route path="generate/images" element={<ImagesQr />} />
        <Route path="generate/video" element={<VideoQr />} />
        <Route path="generate/music" element={<MusicQr />} />
        <Route path="generate/landingpage" element={<LandingPageQr />} />
        <Route path="generate/coupan" element={<CoupanQR />} />
        <Route path="generate/pdf" element={<PdfQr />} />
        <Route path="generate/app" element={<AppQr />} />
        <Route path="generate/listoflinks" element={<ListOfLinksQr />} />
        <Route path="generate/shopmenu" element={<ShopMenuForm/>} />
        <Route path="generate/socialprofile" element={<SocialProfile />} />
        <Route path="generate/business" element={<TimeScheduleForm />} />
        <Route path="generate/vcardplus" element={<VcardPlusQR />} />
        <Route path="generate/product" element={<ProductQr />} />
        <Route path="generate/event" element={<EventQrForm />} />

        {/* static  */}
        
        <Route path="generate/url" element={<Urlqr />} />
        <Route path="generate/wifi" element={<Wifiqr />} />
        <Route path="generate/message" element={<MessageQr />} />
        <Route path="generate/sms" element={<Smsqr />} />
        <Route path="generate/email" element={<EmailQrGenerator />} />
        <Route path="generate/vcard" element={<VcardCreate/>} />
        <Route path="generate/instagram" element={<InstagramQr/>} />
        <Route path="generate/facebook" element={<FacebookQr/>} />
        <Route path="generate/whatsapp" element={<WhatsAppQrGenerator />} />
        <Route path="generate/barcode" element={<BarcodeGenerator />} />

        {/* Edit Dynamic Qr */}

        </Routes>
      </div>
    </div>
  );
};
export default Dashboard;
