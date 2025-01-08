import React, { useEffect ,useState} from 'react';
import './SocialProfile.css';

const SocialProfileDisplay = ({ ConfigurationSocialData,socialDataGet,customization, data }) => {
  const [showData, setShowData] = useState(null);
  const [showConfig, setShowConfig] = useState(null);

  useEffect(() => {
      const afterScanData = localStorage.getItem("afterScan");

      if (afterScanData) {
          setShowData(socialDataGet);
          setShowConfig(ConfigurationSocialData);
      } else {
          setShowData(data);
          setShowConfig(customization);
      }

      const timeoutId = setTimeout(() => {
          localStorage.removeItem("afterScan");
      }, 3000);

      return () => clearTimeout(timeoutId);
  }, [data, socialDataGet, ConfigurationSocialData, customization]);

  if (showConfig === null) return <div>Loading...</div>;
  if (!showData) return <div>Loading...</div>; // Render a placeholder or loading state

  const {
    titleColor,
    textColor,
    primaryColor,
    secondaryColor,
    buttonColor,
    buttonTextColor,
    fontFamily,
    icons_color,
  } = showConfig;

  const { social_social_networks, Social_welcome_screen, Social_welcome_screen_time, social_display_theme } = showData;

  // Social media icons with mappings
  const socialMediaIcons = [
    { platform: "Facebook", icon: "ri-facebook-circle-line" },
    { platform: "Twitter", icon: "ri-twitter-line" },
    { platform: "Instagram", icon: "ri-instagram-line" },
    { platform: "LinkedIn", icon: "ri-linkedin-box-line" },
    { platform: "YouTube", icon: "ri-youtube-line" },
    { platform: "TikTok", icon: "ri-music-line" },
    { platform: "Snapchat", icon: "ri-snapchat-line" },
    { platform: "WhatsApp", icon: "ri-whatsapp-line" },
    { platform: "Pinterest", icon: "ri-pinterest-line" },
    { platform: "Reddit", icon: "ri-reddit-line" },
    { platform: "Tumblr", icon: "ri-tumblr-line" },
    { platform: "Vimeo", icon: "ri-play-circle-line" },
    { platform: "Skype", icon: "ri-skype-line" },
    { platform: "Spotify", icon: "ri-music-line" },
    { platform: "Discord", icon: "ri-discord-line" },
    { platform: "Telegram", icon: "ri-telegram-line" },
    { platform: "Slack", icon: "ri-slack-line" },
    { platform: "WeChat", icon: "ri-wechat-line" },
    { platform: "Messenger", icon: "ri-message-line" },
  ];
  console.log('customization',customization)
  console.log('data',data)

  return (
    <div className={`${social_display_theme}-social-profile`}
    style={{
      '--primary-color': primaryColor,
      '--title-color': titleColor,
      '--text-color': textColor,
      '--icons-color': icons_color,
      '--secondary-color': secondaryColor,
      '--button-color': buttonColor,
      '--button-text-color': buttonTextColor,
      '--font-family': fontFamily,
  }}
  >
      <div className={`${social_display_theme}-social-profile__header`}>Social Profile</div>
      <div className={`${social_display_theme}-social-profile__networks`}>
        {social_social_networks.map((network, index) => {
          const matchedIcon = socialMediaIcons.find((icon) => icon.platform === network.platform);
          return (
            <div className={`${social_display_theme}-social-profile__network`} key={index}>
              {matchedIcon && (
                <i
                  className={`${matchedIcon.icon} ${social_display_theme}-social-profile__icons`}
                  aria-hidden="true"
                ></i>
              )}
              <a
                href={network.link}
                className={`${social_display_theme}-social-profile__network-link`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className='title-of-social-network'>{network.platform}</p><br />
                {network.message}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialProfileDisplay;
