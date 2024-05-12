import React, { useState } from 'react';
import WelcomePage from './WelcomePage';

const checkCode = async (code) => {
    const resp = await fetch(`http://localhost:3000/`);
    const data = await resp.json();
    return data;
};

const CodePage = () => {
    const [code, setCode] = useState('');
    const [verificationResult, setVerificationResult] = useState('');
    const [canProceed, setCanProceed] = useState(false); 

    const handleChange = (event) => {
        setCode(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();


        try {
            const exists = await checkCode(code);
            if (exists) {
                setVerificationResult('Kod jest g :)');
                setCanProceed(true); 
            } else {
                setVerificationResult('Kod nie jest g :(');
            }
        } catch (error) {
            console.error('błąd', error);
            setVerificationResult('Sory bro ale jest błąd');
        } 
    };

    if (canProceed) {
        return <WelcomePage />; 
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Kod:</h2>
                <input type="text" placeholder='Podaj kod' value={code} onChange={handleChange} />
                <button type="submit" >Sprawdź kod</button>
            </form>

            <p>{verificationResult}</p>
        </div>
    );
};

export default CodePage;
