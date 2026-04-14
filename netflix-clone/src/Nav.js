import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Nav.css';

function Nav({ onLogout, onSearch, isLanding }) {
  const [show, handleShow] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [query, setQuery] = useState("");
  const [currentProfile, setCurrentProfile] = useState({
    name: "Adult",
    img: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
  });

  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => handleShow(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchInput = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleLogoClick = () => {
    setQuery("");
    onSearch("");
    setShowSearch(false);
    navigate('/home');
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const switchProfile = (name, img) => {
    setCurrentProfile({ name, img });
    setShowDropdown(false);
  };

  return (
    <div className={`nav ${show && "nav__black"}`}>
      <div className="nav__contents">
        <img
          className="nav__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
          alt="Netflix Logo"
          onClick={handleLogoClick}
        />
        
        <div className="nav__right">
          <div className="nav__languageContainer">
            <select className="nav__languageSelect" value={i18n.language} onChange={handleLanguageChange}>
              <option value="en">English</option>
              <option value="tl">Tagalog</option>
            </select>
          </div>

          {!isLanding ? (
            <>
              <div className={`nav__searchContainer ${showSearch && "nav__searchActive"}`}>
                <img 
                  onClick={() => setShowSearch(!showSearch)}
                  className="nav__searchIcon" 
                  src="https://cdn-icons-png.flaticon.com/512/54/54481.png" 
                  alt="Search" 
                />
                <input 
                  className="nav__searchInput"
                  type="text"
                  placeholder="Titles, genres..."
                  value={query}
                  onChange={handleSearchInput}
                />
              </div>

              <div className="nav__profileContainer">
                <div className="nav__avatarWrapper" onClick={() => setShowDropdown(!showDropdown)}>
                  <img className="nav__avatar" src={currentProfile.img} alt="Avatar" />
                  <span className={`nav__caret ${showDropdown && "nav__caretRotated"}`}></span>
                </div>
                
                {showDropdown && (
                  <div className="nav__dropdown">
                    <div className="nav__dropdownTriangle"></div>
                    <div className="nav__dropdownProfiles">
                      {currentProfile.name === "Adult" ? (
                        <div className="nav__dropdownItem" onClick={() => switchProfile("Kids", "/netflix-kids-logo.jpg")}>
                          <img src="/netflix-kids-logo.jpg" alt="Kids" />
                          <span>Kids</span>
                        </div>
                      ) : (
                        <div className="nav__dropdownItem" onClick={() => switchProfile("Adult", "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png")}>
                          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="Adult" />
                          <span>Adult</span>
                        </div>
                      )}
                      <div className="nav__dropdownItem nav__manageProfiles">
                        <span>Manage Profiles</span>
                      </div>
                    </div>
                    <hr className="nav__dropdownDivider" />
                    <div className="nav__dropdownLinks">
                      <p onClick={() => navigate('/account')}>Account</p>
                      <a href="https://help.netflix.com/" target="_blank" rel="noreferrer" className="nav__dropdownLink">Help Center</a>
                      <p onClick={onLogout} className="nav__signOut">Sign out of Netflix</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button className="nav__signInButton" onClick={() => navigate('/sign-in')}>Sign In</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;