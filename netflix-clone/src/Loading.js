import React, { useEffect, useState } from 'react';
import './Loading.css';

function Loading() {
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFade(true);
        }, 3000); 
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className={`loading ${fade && 'loading__fadeOut'}`}>
            <img
                className="loading__logo"
                src="nouzen.webp"
                alt="Netflix"
            />
        </div>
    );
}

export default Loading;