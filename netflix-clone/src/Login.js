import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        
        onLogin(email, password);
        
        navigate('/home');
    };

    return (
        <div className="login">
            <div className="login__header">
                <img
                    className="login__logo"
                    src="nouzen.webp"
                    alt="Netflix Logo"
                    onClick={() => navigate('/')} 
                />
            </div>

            <div className="login__body">
                <form onSubmit={handleSubmit}>
                    <h1>Sign In</h1>
                    <input 
                        type="email" 
                        placeholder="Email or phone number" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                    <button type="submit">Sign In</button>
                    
                    <div className="login__help">
                        <div className="login__remember">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </div>
                        <p>Need help?</p>
                    </div>

                    <div className="login__footer">
                        <p>New to Netflix? <span onClick={() => navigate('/sign-up')}>Sign up now.</span></p>
                    </div>
                </form>
            </div>
            <div className="login__gradient" />
        </div>
    );
}

export default Login;