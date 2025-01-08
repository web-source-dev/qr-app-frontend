import React, { useEffect, useState } from "react";
import '../themes/businessthemes.css';
import "remixicon/fonts/remixicon.css";
import Timeschedule from "./days-current";
import BusinessSlider from "./imageslider";
const DefaultBusinessTheme = ({ businessData, businessDataGet, ConfigurationData, customization = {} }) => {
    const [showData, setShowData] = useState(null);
    const [showConfig, setShowConfig] = useState(null);

    useEffect(() => {
        const afterScanData = localStorage.getItem("afterScan");

        if (afterScanData) {
            setShowData(businessDataGet);
            setShowConfig(ConfigurationData);
        } else {
            setShowData(businessData);
            setShowConfig(customization);
        }

        const timeoutId = setTimeout(() => {
            localStorage.removeItem("afterScan");
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, [businessData, businessDataGet, ConfigurationData, customization]);

    if (showConfig === null) return <div>Loading...</div>;
    if (!showData) return <div>Loading...</div>; // Render a placeholder or loading state

    const { titleColor, textColor, primaryColor, secondaryColor, buttonColor, buttonTextColor, fontFamily, icons_color } = showConfig;

    const {
        business_logo_qr,
        business_company,
        business_title,
        business_subtitle,
        business_button_text,
        business_slider_images,
        business_address,
        business_facilities,
        business_about,
        business_contact_numbers,
        business_emails,
        business_social_networks,
        business_welcome_screen,
        business_schedule,
        business_website_name,
        business_website_url,
        business_display_theme,
    } = showData;

    const facilityIcons = [
        { name: "WiFi", icon: "ri-wifi-line" },
        { name: "Tea", icon: "ri-cup-line" },
        { name: "Coffee", icon: "ri-coffee-line" },
        { name: "Parking", icon: "ri-parking-box-line" },
        { name: "A-C", icon: "ri-snowy-line" },
        { name: "Pets", icon: "ri-paw-line" },
        { name: "Smoke Area", icon: "ri-smoking-line" },
        { name: "Wheelchair", icon: "ri-wheelchair-line" },
        { name: "Restrooms", icon: "ri-restroom-line" },
        { name: "Charging", icon: "ri-battery-charge-line" },
        { name: "Projector", icon: "ri-projector-line" },
        { name: "Whiteboard", icon: "ri-book-2-line" },
        { name: "TV", icon: "ri-tv-line" },
        { name: "Gym", icon: "ri-dumbbell-line" },
        { name: "Swimming Pool", icon: "ri-swim-line" },
        { name: "CCTV", icon: "ri-camera-line" },
        { name: "Fire Safety", icon: "ri-fire-line" },
        { name: "First Aid", icon: "ri-first-aid-kit-line" },
        { name: "Library", icon: "ri-book-open-line" },
        { name: "Game Zone", icon: "ri-gamepad-line" },
      ];
      
      const socialMediaIcons = [
        { name: "Facebook", icon: "ri-facebook-circle-line" },
        { name: "Twitter", icon: "ri-twitter-line" },
        { name: "Instagram", icon: "ri-instagram-line" },
        { name: "LinkedIn", icon: "ri-linkedin-box-line" },
        { name: "YouTube", icon: "ri-youtube-line" },
        { name: "TikTok", icon: "ri-music-line" },
        { name: "Snapchat", icon: "ri-snapchat-line" },
        { name: "WhatsApp", icon: "ri-whatsapp-line" },
        { name: "Pinterest", icon: "ri-pinterest-line" },
        { name: "Reddit", icon: "ri-reddit-line" },
        { name: "Tumblr", icon: "ri-tumblr-line" },
        { name: "Vimeo", icon: "ri-play-circle-line" },
        { name: "Skype", icon: "ri-skype-line" },
        { name: "Spotify", icon: "ri-music-line" },
        { name: "Discord", icon: "ri-discord-line" },
        { name: "Telegram", icon: "ri-telegram-line" },
        { name: "Slack", icon: "ri-slack-line" },
        { name: "WeChat", icon: "ri-wechat-line" },
        { name: "Messenger", icon: "ri-message-line" },
      ];
      
      return (
        <div
    className={`${business_display_theme}-theme`}
    style={{
        '--primary-color': primaryColor || '#69ccb3',
        '--title-color': titleColor || '#980031',
        '--text-color': textColor || '#000',
        '--icons-color': icons_color || '#982231',
        '--secondary-color': secondaryColor || '#9822314a',
        '--button-color': buttonColor || '#982231',
        '--button-text-color': buttonTextColor || '#000',
        '--font-family': fontFamily || 'sans-serif',
    }}
>
    <div>
    {business_logo_qr && (
    <div className={`${business_display_theme}-logo-container`}>
        <img src={business_logo_qr} alt="Business Logo" className={`${business_display_theme}-logo`} />
            {business_display_theme === 'theme1' && 
                    <svg className={`${business_display_theme}-wave`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path
                        fill="#ffffff"  /* Change this color to match your theme */
                        fillOpacity="1"
                        d="M0,224L30,208C60,192,120,160,180,133.3C240,107,300,85,360,90.7C420,96,480,128,540,144C600,160,660,160,720,149.3C780,139,840,117,900,117.3C960,117,1020,139,1080,149.3C1140,160,1200,160,1260,144C1320,128,1380,96,1410,80L1440,64L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
                    ></path>
                </svg>
                }
    </div>
)}

        {business_company && (
            <h1 className={`${business_display_theme}-company`}>{business_company}</h1>
        )}


        {business_title && (
            <h1 className={`${business_display_theme}-title`}>{business_title}</h1>
        )}

        {business_subtitle && (
            <h2 className={`${business_display_theme}-subtitle`}>{business_subtitle}</h2>
        )}

        {business_about && (
            <div style={{ marginBottom: '20px', textAlign: 'left' }} className={`${business_display_theme}-section-box`}>
                <h3>About</h3>
                <p className={`${business_display_theme}-about`}>{business_about}</p>
            </div>
        )}

        {business_address.street || business_address.city || business_address.state || business_address.zip ? (
            <div className={`${business_display_theme}-section-box`}>
                <h3>Address</h3>
                <p className={`${business_display_theme}-address`}>
                    <i className="ri-map-pin-line"></i>
                    {`${business_address.street}, ${business_address.city}, ${business_address.state} ${business_address.zip}`}
                </p>
            </div>
        ) : null}

        {business_contact_numbers && business_contact_numbers.length >= 1 && (
            <div className={`${business_display_theme}-section-box`}>
                <h3>Contact Numbers</h3>
                <ul>
                    {business_contact_numbers.map((number, index) => (
                        <li key={index} className={`${business_display_theme}-contact`}>
                            <i className="ri-phone-line"></i>
                            {number}
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {business_emails && business_emails.length >= 1 && (
            <div className={`${business_display_theme}-section-box`}>
                <h3>Email Addresses</h3>
                <ul>
                    {business_emails.map((email, index) => (
                        <li key={index} className={`${business_display_theme}-email`}>
                            <i className="ri-mail-line"></i>
                            {email}
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {business_social_networks && business_social_networks.length > 0 && (
            <div className={`${business_display_theme}-section-box`}>
                <h3>Social Networks</h3>
                <ul className={`${business_display_theme}-social-list`}>
                    {business_social_networks.map(({ platform, message }, index) => {
                        const matchedSocial = socialMediaIcons.find((s) => s.name === platform);
                        return (
                            <li key={index} className={`${business_display_theme}-social`}>
                                <i className={`social-icon ${matchedSocial ? matchedSocial.icon : "ri-question-line"}`}></i>
                                {message}
                            </li>
                        );
                    })}
                </ul>
            </div>
        )}

        {business_facilities && business_facilities.length > 0 && (
            <div className={`${business_display_theme}-section-box`}>
                <h3>Facilities</h3>
                <ul className={`${business_display_theme}-facility-list`}>
                    {business_facilities.map((facility, index) => {
                        const matchedFacility = facilityIcons.find((f) => f.name === facility);
                        return (
                            <li key={index} className={`${business_display_theme}-facility`}>
                                <i className={`facility-icon ${matchedFacility ? matchedFacility.icon : "ri-question-line"}`}></i>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )}

        {business_schedule && business_schedule.length > 0 && (
            <Timeschedule business_schedule={business_schedule} business_display_theme={business_display_theme} />
        )}

        {business_website_name && business_website_url && (
            <div className={`${business_display_theme}-section-box`}>
               <div className={`${business_display_theme}-new-line`}>
               <h3>Website</h3>
                <a
                    href={business_website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${business_display_theme}-website-link`}
                >
                    {business_website_name}
                </a>
               </div>
            </div>
        )}

        {business_slider_images && business_slider_images.length > 0 && (
            <BusinessSlider business_slider_images={business_slider_images} business_display_theme={business_display_theme}/>
        )}

        {business_button_text && (
            <button className={`${business_display_theme}-btn-of-live-preview-mobile`}>
                {business_button_text}
            </button>
        )}
    </div>
</div>

    );
    
};

export default DefaultBusinessTheme;
