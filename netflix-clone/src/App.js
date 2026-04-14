import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './Loading.css';
import Row from './Row';
import requests from './requests';
import Banner from './Banner';
import Nav from './Nav';
import Login from './Login';
import SignUp from './SignUp';
import LandingPage from './LandingPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFading(true), 2000);
    const loadTimer = setTimeout(() => setLoading(false), 3000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(loadTimer);
    };
  }, []);

  const handleLogin = (email, password) => {
    if (!email || !password) return;
    setLoading(true);
    setIsFading(false);
    setTimeout(() => {
      setUser({ name: "Felipe" });
      setIsFading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }, 1500);
  };

  if (loading) {
    return (
      <div className={`loading ${isFading ? 'loading__fadeOut' : ''}`}>
        <img 
          className="loading__logo"
          src="nouzen.webp" 
          alt="Netflix Logo"
        />
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/home" />} />
          <Route path="/sign-in" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/home" />} />
          <Route path="/sign-up" element={!user ? <SignUp onLogin={handleLogin} /> : <Navigate to="/home" />} />
          
          <Route 
            path="/home" 
            element={user ? (
              <>
                <Nav onLogout={() => setUser(null)} onSearch={(term) => setSearchTerm(term)} />
                
                {searchTerm ? (
                  <div className="search__results">
                    <h2>Explore titles related to: {searchTerm}</h2>
                    <Row 
                      title={`Explore titles related to: ${searchTerm}`}
                      fetchUrl={requests.fetchSearch(searchTerm)} 
                      searchTerm={searchTerm} 
                      isSearchGrid={true}
                    />
                  </div>
                ) : (
                  <>
                    <Banner />
                    <div className="app__rows">
                      <Row title="NETFLIX ORIGINALS" fetchUrl={requests.fetchNetflixOriginals} isLargeRow />
                      <Row title="Trending Now" fetchUrl={requests.fetchTrending} />
                      <Row title="Top Rated" fetchUrl={requests.fetchTopRated} />
                      <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} />
                      <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
                      <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} />
                      <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} />
                    </div>
                  </>
                )}
              </>
            ) : (
              <Navigate to="/" />
            )} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;