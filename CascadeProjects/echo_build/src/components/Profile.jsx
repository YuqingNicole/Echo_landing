import React, { useState, useEffect } from 'react';
import '../styles/profile.css';
import LinkedInAuth from './LinkedInAuth';
import { getProfile, getEmail, getProfilePicture, getConnectionsCount } from '../services/linkedinService';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [isLinkedInConnected, setIsLinkedInConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already connected to LinkedIn
    const linkedInToken = localStorage.getItem('linkedin_access_token');
    if (linkedInToken) {
      fetchLinkedInData();
    }
  }, []);

  const fetchLinkedInData = async () => {
    try {
      setIsLoading(true);
      const [profile, email, connectionsCount] = await Promise.all([
        getProfile(),
        getEmail(),
        getConnectionsCount(),
      ]);
      
      setUserData({
        name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
        email,
        connections: connectionsCount,
        profilePicture: await getProfilePicture(),
      });
      
      setIsLinkedInConnected(true);
    } catch (error) {
      console.error('Error fetching LinkedIn data:', error);
      // Handle error (e.g., token expired)
      localStorage.removeItem('linkedin_access_token');
      setIsLinkedInConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInSuccess = (data) => {
    console.log('LinkedIn connected successfully');
    fetchLinkedInData();
  };

  const handleLinkedInFailure = (error) => {
    console.error('LinkedIn connection failed:', error);
    // Handle error
  };

  const stats = [
    { label: 'Total Matches', value: '24' },
    { label: 'Success Rate', value: '92%' },
    { label: 'Connections', value: userData?.connections || '0' },
    { label: 'Rating', value: '4.8/5' },
  ];

  const metrics = [
    { 
      title: 'Matching Score', 
      value: '87', 
      description: 'Based on your profile and preferences',
      trend: '↑ 2% from last month'
    },
    { 
      title: 'Response Rate', 
      value: '95%', 
      description: 'You respond to 95% of matches',
      trend: '↑ 5% from last month'
    },
    { 
      title: 'Active Streak', 
      value: '14 days', 
      description: 'You\'ve been active for 14 days in a row',
      trend: '🔥 3 day streak'
    },
    { 
      title: 'Profile Strength', 
      value: '92%', 
      description: 'Your profile is 92% complete',
      trend: 'Complete your profile'
    },
  ];

  // If not connected to LinkedIn, show the connection prompt
  if (!isLinkedInConnected) {
    return (
      <div className="profile-container">
        <div className="connection-card">
          <div className="connection-content">
            <h2>Connect Your LinkedIn</h2>
            <p>Enhance your profile by connecting with LinkedIn to showcase your professional experience and network.</p>
            <button 
              className="linkedin-connect-button"
              onClick={() => {
                // Redirect to LinkedIn OAuth URL
                const clientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID;
                const redirectUri = encodeURIComponent(process.env.REACT_APP_LINKEDIN_REDIRECT_URI);
                const scope = encodeURIComponent('r_liteprofile r_emailaddress');
                const state = encodeURIComponent('some-random-state-string');
                const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
                window.location.href = linkedInAuthUrl;
              }}
            >
              <img 
                src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Logo.png.original.png" 
                alt="LinkedIn" 
                className="linkedin-logo"
              />
              <span>Continue with LinkedIn</span>
            </button>
            <p className="privacy-notice">We'll only access your public profile and email address.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading your profile...</div>
      </div>
    );
  }
  
  // Show profile when connected
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {userData?.profilePicture ? (
            <img src={userData.profilePicture} alt="Profile" className="avatar" />
          ) : (
            <span className="avatar">👤</span>
          )}
        </div>
        <div className="profile-info">
          <h1>{userData?.name || 'Your Name'}</h1>
          <p>{userData?.email || 'No email available'}</p>
          <div className="profile-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-icon">{stat.icon || '📊'}</span>
                <div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">{metric.icon}</span>
              <h3>{metric.title}</h3>
            </div>
            <div className="metric-value">{metric.value}</div>
            <p className="metric-description">{metric.description}</p>
            <div className="metric-trend">{metric.trend}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
