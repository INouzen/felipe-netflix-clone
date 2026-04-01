import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SignUp.css';

function SignUp({ onLogin }) {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [email, setEmail] = useState(location.state?.email || "");
    const [password, setPassword] = useState("");

    const handleSignUp = (e) => {
        e.preventDefault();
        onLogin(email, password);
        navigate('/home');
    };

    return (
        <div className="signUp">
            {/* Same layout as Login.js */}
            <div className="signUp__body">
                <form onSubmit={handleSignUp}>
                    <h1>Sign Up</h1>
                    <input 
                        type="email" 
                        placeholder="Email address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Add a password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                    <button type="submit">Sign Up</button>
                    <p>Already have an account? <span onClick={() => navigate('/sign-in')}>Sign in now.</span></p>
                </form>
            </div>
        </div>
    );
}

export default SignUp;