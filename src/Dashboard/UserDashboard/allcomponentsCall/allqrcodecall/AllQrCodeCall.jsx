import React, { useState } from 'react';
import './AllQrCode.css'; // Import external CSS
import Wifiqr from '../../../../allqrcodefiles/wifiqr/wifiqr';
import TimeScheduleForm from '../../../../allqrcodefiles/businesscsvqr/BusinessCsvqr';
import SocialProfile from '../../../../allqrcodefiles/socialprofile/SocialProfile';
import FacebookQr from '../../../../allqrcodefiles/facebookaccountqr/facebookaccountqr';
import InstagramQr from '../../../../allqrcodefiles/instagramaccountqr/instagramaccounqr';
import Urlqr from '../../../../allqrcodefiles/urlqr/urlqr';
import MessageQr from '../../../../allqrcodefiles/messageqr/messageqr';
import VcardCreate from '../../../../allqrcodefiles/vcardqr/vcardcreateqr';
import EmailQrGenerator from '../../../../allqrcodefiles/emailsendqr/emailsendqr';
import WhatsAppQrGenerator from '../../../../allqrcodefiles/whatsappqrmsg/whatsappqrmsg';
import Smsqr from '../../../../allqrcodefiles/smsqr/smsqr';
import ShopMenuForm from '../../../../allqrcodefiles/ShopMenuCard/ShopMenu';
import ImagesQr from '../../../../allqrcodefiles/Imagesqr/ImagesQr';
import VideoQr from '../../../../allqrcodefiles/VideoQr/VideoQr';
import PdfQr from '../../../../allqrcodefiles/PdfQr/PdfQr';
import MusicQr from '../../../../allqrcodefiles/MusicQR/MusicQR';
import VcardPlusQR from '../../../../allqrcodefiles/VcardPlusQr/VcardPlusQr';
import ListOfLinksQr from '../../../../allqrcodefiles/ListOfLinks/ListofLinks';
import CoupanQR from '../../../../allqrcodefiles/CoupanQr/CoupanQr';
import LandingPageQr from '../../../../allqrcodefiles/LandingPage/LandingPage';
import AppQr from '../../../../allqrcodefiles/AppQr/AppQr';
import ProductQr from '../../../../allqrcodefiles/ProductQr/ProductQr';
import EventQrForm from '../../../../allqrcodefiles/EventQr/EventQr';
import BarcodeGenerator from '../../../../allqrcodefiles/Barcode/Barcode';

const AllQrCodeCall = () => {
  const [selectedBox, setSelectedBox] = useState(null);
  const [hoveredBox, setHoveredBox] = useState(null); // State for hovered box

  // List of box names with image links
  const DynamicQrSelector = [
    { id: 'social',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734954653/fkzn9jcvtz33drgenhse.png',
     message: 'Share Your Social profiles',
     label: 'Social Media',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734956609/rugh06hlfmkxtww3xbfl.png' },
    { id: 'business',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734954637/gsnieyype2q0p0keqsmj.png',
     message: 'Share Information about your business',
     label: 'Business',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734957012/bwnm9bzrjmbdffdjrfca.png' },
    { id: 'shopmenu',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734954633/r0mrj677b7sfcf29k5ps.png',
     message: 'Display the menu of a restaurant or bar ',
     label: 'Menu',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734271510/qbafqacdvs0q6a6hx7ds.png' },
     { id: 'images',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735891915/rqhhjrplktcu4rphboxx.png',
     message: 'Show an Image Gallery',
     label: 'Images',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734271510/qbafqacdvs0q6a6hx7ds.png' },
     { id: 'videos',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735891911/diqlmql9lwkrvtpyp1e6.png',
     message: 'Show a Video or multiple videos',
     label: 'Video',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734271510/qbafqacdvs0q6a6hx7ds.png' },
     { id: 'pdf',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735891907/vtxoa3ydrnpc3t5jbnba.png',
     message: 'Show a PDF',
     label: 'PDF',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734271510/qbafqacdvs0q6a6hx7ds.png' },
     { id: 'music',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735891902/gopie3hoima44dg9fia0.png',
     message: 'Play a music or create a playlist',
     label: 'Music',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734271510/qbafqacdvs0q6a6hx7ds.png' },
     { id: 'vcardplus',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734955074/dewivaw0oiz4zttdcabp.png',
     message: 'Share Contact Details',
     label: 'V-Card Plus',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734271510/qbafqacdvs0q6a6hx7ds.png' },
     { id: 'listoflinks',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1736057980/vkacrzbi1zt43vjk7ogu.png',
     message: 'Share your own links which you want to share',
     label: 'List of Links',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734271510/qbafqacdvs0q6a6hx7ds.png' },
     { id: 'coupan',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1736073669/idksa5vcfhhr4ezdcocc.png',
     message: 'Share a coupan',
     label: 'Coupan',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734271510/qbafqacdvs0q6a6hx7ds.png' },
     { id: 'landingpage',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1736085232/eumdkj2tc9vqki6wckd2.png',
     message: 'Create your own page',
     label: 'Landing Page',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734271510/qbafqacdvs0q6a6hx7ds.png' },
     { id: 'app',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1736162766/ky6zxrjm5wd62wqzbrqm.png',
     message: 'Redirect to App Store',
     label: 'App',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734271510/qbafqacdvs0q6a6hx7ds.png' },
     { id: 'product',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1736162527/q7d83ycaqdcn6mtk1j3s.png',
     message: 'Group Information about your product',
     label: 'Product',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734271510/qbafqacdvs0q6a6hx7ds.png' },
     { id: 'event',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1736162647/kbgpp10na4hmlq4haxjl.png',
     message: 'Promote and Share an event',
     label: 'Event',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734271510/qbafqacdvs0q6a6hx7ds.png' },
    ];

  const StaticQrSelector = [
    { id: 'wifiqr',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734954619/o6y5zv2prgahqxgxsfsx.png',
     message: 'Connect to a wifi network',
     diplaymessage:'Connect to a wifi network',
     diplaytitle:'WiFi',
     label: 'WiFi',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734958128/b9erkicjvxb5pqxg3gv1.png' },
    { id: 'facebookqr',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734954606/isf5sdbccijev8iaqpch.png',
     message: 'Share your Facebook profile',
     diplaymessage:'Share your Facebook profile',
     diplaytitle:'Facebook',
     label: 'Facebook',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734958128/b9erkicjvxb5pqxg3gv1.png' },
    { id: 'instaqr',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734955005/q0rlfu7ckizeyqicorgp.png',
     message: 'Share your Instagram profile',
     diplaymessage:'Share your Instagram profile',
     diplaytitle:'Instagram',
     label: 'Instagram',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734958128/b9erkicjvxb5pqxg3gv1.png' },
    { id: 'urlqr',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734954687/y8tllyoscpiw5t7prrr1.png',
     message: 'Open a Url',
     diplaymessage:'Open a Url',
     diplaytitle:'URL',
     label: 'URL',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734958128/b9erkicjvxb5pqxg3gv1.png' },
    { id: 'message',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734954629/fxnekldglgukewjhwbe3.png',
     message: 'Display a Message',
     diplaymessage:'Display a Message',
     diplaytitle:'Message',
     label: 'Message',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734958128/b9erkicjvxb5pqxg3gv1.png' },
    { id: 'vcard',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734955074/dewivaw0oiz4zttdcabp.png',
     message: 'Share and store your contact details',
     diplaymessage:'Share and store your contact details',
     diplaytitle:'VCard',
     label: 'VCard',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734958128/b9erkicjvxb5pqxg3gv1.png' },
    { id: 'emailqr',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734954614/sdmcsdnmdmddhs2fmofj.png',
     message: 'Send an email with predefined text',
     diplaymessage:'Send an email with predefined text',
     diplaytitle:'Email',
     label: 'Email',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734958128/b9erkicjvxb5pqxg3gv1.png' },
    { id: 'whatsapp',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734954624/nw5tr70kyzo6bf8mwo2r.png',
     message: 'Send a WhatsApp message',
     diplaymessage:'Send a WhatsApp message',
     diplaytitle:'WhatsApp',
     label: 'WhatsApp',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734958128/b9erkicjvxb5pqxg3gv1.png' },
    { id: 'smsqr',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734954610/rpm7zryshmrn0khmzhg0.png',
     message: 'Send a text Message',
     diplaymessage:'Send a text Message',
     diplaytitle:'SMS',
     label: 'SMS',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734958128/b9erkicjvxb5pqxg3gv1.png' },
     { id: 'barcode',
      logoImage:'https://res.cloudinary.com/dcvqytwuq/image/upload/v1736162647/kbgpp10na4hmlq4haxjl.png',
     message: 'Promote and Share an event',
     label: 'Barcode',
     image: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734271510/qbafqacdvs0q6a6hx7ds.png' },
    ];

  return (
    <div className="Select-All-Qr-box-container-main">
      {/* Check if a box is selected */}
      {selectedBox === null ? (
        <div className="make-flex">
          <div className="Select-All-Qr-box-container">
            <div className="dynamic-qr-selector">
              <h2>Dynamic QR Codes</h2>
              <div className="Select-All-Qr-selector-container">
                {DynamicQrSelector.map((item) => (
                  <div
                    key={item.id}
                    className={`Select-All-Qr-box ${selectedBox === item.id ? 'selected' : ''}`}
                    onClick={() => setSelectedBox(item.id)}
                    onMouseEnter={() => setHoveredBox(item)} // Set the entire item object on hover
                    onMouseLeave={() => setHoveredBox(null)} // Reset hover state
                  >
                    <div className="flex-of-image-and-name">
                      
                    <img src={item.logoImage} alt="item.label"/>
                    <div className="sw2">
                    <h4>{item.label}</h4>
                    <p>{item.message}</p>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="static-qr-selector">
              <h2>Static QR Codes</h2>
              <div className="Select-All-Qr-selector-container">
                {StaticQrSelector.map((item) => (
                  <div
                    key={item.id}
                    className={`Select-All-Qr-box ${selectedBox === item.id ? 'selected' : ''}`}
                    onClick={() => setSelectedBox(item.id)}
                    onMouseEnter={() => setHoveredBox(item)} // Set the entire item object on hover
                    onMouseLeave={() => setHoveredBox(null)} // Reset hover state
                  >
                     <div className="flex-of-image-and-name">
                      
                      <img src={item.logoImage} alt="item.label"/>
                      <div className="sw2">
                      <h4>{item.label}</h4>
                      <p>{item.message}</p>
                      </div>
                      </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="display-image-of-selected">
            <div style={{top:'2%',left:'2%',position:'absolute', zIndex:'9999' }} className="camera-mobile"></div>
            {/* {hoveredBox && ( */}
              <div className="display-image-container">
               <img
                src={hoveredBox && hoveredBox.image ? hoveredBox.image : 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1734957191/ph6qu7cfgfxvntymqnxy.png'}
                alt={hoveredBox ? hoveredBox.label : ''}
                className="display-image"
              />
              <h3 style={{top:'70%',left:'10%',position:'absolute', zIndex:'9999' }}>{hoveredBox ? hoveredBox.diplaytitle : ''}</h3>
              <p style={{top:'75%',left:'10%',position:'absolute', zIndex:'9999' }}>{hoveredBox ? hoveredBox.diplaymessage : ''}</p>
              </div>
            {/* )} */}
          </div>
        </div>
      ) : (
        <div className="Select-All-Qr-selected-content">
          <button className="back-button" onClick={() => setSelectedBox(null)}>
            🔙
          </button>
          <div className="Select-All-Qr-content-container">
            {selectedBox === 'shopmenu' && <ShopMenuForm />}
            {selectedBox === 'videos' && <VideoQr />}
            {selectedBox === 'wifiqr' && <Wifiqr />}
            {selectedBox === 'images' && <ImagesQr />}
            {selectedBox === 'business' && <TimeScheduleForm />}
            {selectedBox === 'social' && <SocialProfile />}
            {selectedBox === 'facebookqr' && <FacebookQr />}
            {selectedBox === 'instaqr' && <InstagramQr />}
            {selectedBox === 'urlqr' && <Urlqr />}
            {selectedBox === 'message' && <MessageQr />}
            {selectedBox === 'vcard' && <VcardCreate />}
            {selectedBox === 'emailqr' && <EmailQrGenerator />}
            {selectedBox === 'whatsapp' && <WhatsAppQrGenerator />}
            {selectedBox === 'smsqr' && <Smsqr />}
            {selectedBox === 'pdf' && <PdfQr />}
            {selectedBox === 'music' && <MusicQr />}
            {selectedBox === 'vcardplus' && <VcardPlusQR />}
            {selectedBox === 'listoflinks' && <ListOfLinksQr />}
            {selectedBox === 'coupan' && <CoupanQR />}
            {selectedBox === 'landingpage' && <LandingPageQr />}
            {selectedBox === 'app' && <AppQr />}
            {selectedBox === 'product' && <ProductQr />}
            {selectedBox === 'event' && <EventQrForm />}
            {selectedBox === 'barcode' && <BarcodeGenerator />}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllQrCodeCall;
