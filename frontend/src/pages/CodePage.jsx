import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const CodePage = () => {
  const { email: encodedEmail } = useParams();
  const email = atob(encodedEmail);
  const [userCode, setUserCode] = useState("");
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  const fetchUserCode = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users?email=${email}`);
      const data = await response.json();
      return data.auth;
    } catch (error) {
      console.error("Error fetching code:", error);
    }
  };

  const handleUserCodeChange = (event) => {
    setUserCode(event.target.value);
  };

  const handleVerifyCode = async () => {
    const storedCode = await fetchUserCode();
    if (userCode === storedCode) {
      setIsValid(true);
      navigate("/welcomePage");  // Redirect to WelcomePage
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="container">
      <h2>Enter Verification Code</h2>
      <input
        type="text"
        value={userCode}
        placeholder="Enter code"
        onChange={handleUserCodeChange}
      />
      <button onClick={handleVerifyCode}>Verify</button>
      {isValid ? (
        <p className="success-message">Code verified successfully!</p>
      ) : (
        <p className="error-message">Invalid code. Please try again.</p>
      )}
      <Link to="/">Back to Login Page</Link>
    </div>
  );
};

export default CodePage;
