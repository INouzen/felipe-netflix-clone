import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landingPage">
            <div className="landingPage__background">
                <img
                    className="landingPage__logo"
                    src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
                    alt="Netflix Logo"
                />
                <button 
                    onClick={() => navigate('/sign-in')} 
                    className="landingPage__button"
                >
                    Sign In
                </button>
                <div className="landingPage__gradient" />
            </div>

            <div className="landingPage__body">
                <h1>Unlimited movies, TV shows, and more.</h1>
                <h2>Watch anywhere. Cancel anytime.</h2>
                <h3>Ready to watch? Enter your email to create or restart your membership.</h3>

                <div className="landingPage__input">
                    <form>
                        <input type="email" placeholder="Email Address" />
                        <button 
                            type="button"
                            onClick={() => navigate('/sign-up')} 
                            className="landingPage__getStarted"
                        >
                            GET STARTED
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;