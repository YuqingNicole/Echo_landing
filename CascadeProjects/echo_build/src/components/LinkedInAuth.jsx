import React from 'react';
import { LinkedIn } from 'react-linkedin-login-oauth2';
import axios from 'axios';
import './LinkedInAuth.css';

const LinkedInAuth = ({ onSuccess, onFailure }) => {
  const handleSuccess = async (data) => {
    console.log('LinkedIn OAuth success:', data);
    
    try {
      // Exchange the authorization code for an access token
      const response = await axios.post('http://localhost:3001/api/linkedin/oauth', {
        code: data.code
      });
      
      const { access_token, user } = response.data;
      
      // Store the access token and user data
      localStorage.setItem('linkedin_access_token', access_token);
      localStorage.setItem('linkedin_user', JSON.stringify(user));
      
      // Call the success callback
      onSuccess({ access_token, user });
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      onFailure(error);
    }
  };

  const handleFailure = (error) => {
    console.error('LinkedIn OAuth error:', error);
    onFailure(error);
  };

  return (
    <div className="linkedin-auth">
      <LinkedIn
        clientId={process.env.REACT_APP_LINKEDIN_CLIENT_ID}
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        redirectUri={process.env.REACT_APP_LINKEDIN_REDIRECT_URI}
        renderElement={({ onClick, disabled }) => (
          <button
            onClick={onClick}
            disabled={disabled}
            className="linkedin-button"
          >
            <img
              src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Logo.png.original.png"
              alt="LinkedIn"
              className="linkedin-logo"
            />
            Connect with LinkedIn
          </button>
        )}
      />
    </div>
  );
};

export default LinkedInAuth;
