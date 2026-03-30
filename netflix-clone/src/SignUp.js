import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

function SignUp({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const register = (e) => {
    e.preventDefault();
    // In a real app, you'd send this to Firebase/Backend here
    console.log("Registering:", { fullName, email, password });
    onLogin();
    navigate('/home');
  };

  return (
    <div className="signUp">
      <div className="signUp__header">
        <img
          className="signUp__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
          alt="Netflix Logo"
          onClick={() => navigate('/')}
        />
      </div>

      <div className="signUp__body">
        <form>
          <h1>Create Account</h1>
          <input 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name" 
            type="text" 
          />
          <input 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address" 
            type="email" 
          />
          <input 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (6+ characters)" 
            type="password" 
          />
          <button type="submit" onClick={register}>Sign Up</button>
          
          <div className="signUp__footer">
            <h4>
              <span className="signUp__gray">Already have an account? </span>
              <span className="signUp__link" onClick={() => navigate('/sign-in')}>
                Sign in now.
              </span>
            </h4>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;