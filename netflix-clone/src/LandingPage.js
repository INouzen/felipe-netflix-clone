import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './LandingPage.css';

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
    <div className="landingPage">
      <div className="landingPage__nav">
        <img
          className="landingPage__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
          alt="Netflix Logo"
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
              placeholder={t('email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <button className="landingPage__getStarted" type="submit">
              {t('get_started')} {">"}
            </button>
          </form>
        </div>
      </div>
      <div className="landingPage__gradient" />
    </div>
  );
}

export default LandingPage;