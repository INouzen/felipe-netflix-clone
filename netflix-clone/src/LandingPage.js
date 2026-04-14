import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './LandingPage.css';
import backgroundImageFile from './netflix-landing-page.jpg'; 

function LandingPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleGetStarted = (e) => {
    e.preventDefault();
    navigate('/sign-up', { state: { email } });
  };

  return (
    <div 
      className="landingPage"
      style={{
        height: "100vh",
        backgroundSize: "cover",
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8) 0, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.8) 100%), url(${backgroundImageFile})`,
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div className="landingPage__nav">
        <img
          className="nouzen.webp"
          src="nouzen.webp"
          alt="Logo"
        />
        <div className="landingPage__navRight">
          <select className="landingPage__language" onChange={changeLanguage}>
            <option value="en">English</option>
            <option value="tl">Tagalog</option>
          </select>
          <button className="landingPage__signIn" onClick={() => navigate('/sign-in')}>
            {t('sign_in')}
          </button>
        </div>
      </div>

      <div className="landingPage__contents">
        <h1>{t('hero_title')}</h1>
        <h2>{t('hero_subtitle')}</h2>
        <h3>{t('hero_cta')}</h3>
        
        <div className="landingPage__input">
          <form onSubmit={handleGetStarted}>
            <input 
              type="email" 
              name="entry_field_1"
              placeholder={t('email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required 
            />
            <button className="landingPage__getStarted" type="submit">
              {t('get_started')} {">"}
            </button>
          </form>
        </div>
      </div>

      <div className="landingPage__gradient" />

      <div style={{ 
        fontSize: '10px', 
        color: 'rgba(255, 255, 255, 0.1)', 
        textAlign: 'center', 
        width: '100%',
        position: 'absolute',
        bottom: '10px',
        zIndex: '10'
      }}>
        Educational Project - No data collected - Felipe 2026
      </div>
    </div>
  );
}

export default LandingPage;