import React, { useState, useEffect } from 'react';
import './Nav.css';

function Nav({ onLogout, onSearch }) {
  const [show, handleShow] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => handleShow(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchInput = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className={`nav ${show && "nav__black"}`}>
      <div className="nav__contents">
        <img
          className="nav__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
          alt="Netflix Logo"
        />
        
        <div className="nav__right">
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

          <div className="nav__avatarContainer">
            <img
              onClick={() => setShowMenu(!showMenu)}
              className="nav__avatar"
              src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
              alt="Avatar"
            />

            {showMenu && (
              <div className="nav__menu">
                <div className="nav__menuItem" onClick={onLogout}>Sign out of Netflix</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;