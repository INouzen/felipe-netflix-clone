import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="login">
      <div className="login__header">
        <img
          className="login__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
          alt="Netflix Logo"
          onClick={() => navigate('/')}
        />
      </div>

      <div className="login__body">
        <form>
          <h1>Sign In</h1>
          <input placeholder="Email or mobile number" type="email" />
          <input placeholder="Password" type="password" />
          <button type="submit" onClick={signIn}>Sign In</button>
          
          <div className="login__footer">
            <h4>
              <span className="login__gray">New to Netflix? </span>
              <span className="login__link" onClick={() => navigate('/')}>
                Sign up now.
              </span>
            </h4>
            <p>This page is protected by Google reCAPTCHA to ensure you're not a bot.</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;