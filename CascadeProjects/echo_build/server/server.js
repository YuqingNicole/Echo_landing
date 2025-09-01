require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// LinkedIn OAuth endpoints
app.post('/api/linkedin/oauth', async (req, res) => {
  try {
    const { code } = req.body;
    
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.REACT_APP_LINKEDIN_REDIRECT_URI,
        client_id: process.env.REACT_APP_LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, expires_in } = tokenResponse.data;
    
    // Get user profile
    const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    // Get email address
    const emailResponse = await axios.get(
      'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      }
    );

    // Return user data and access token
    res.json({
      access_token,
      expires_in,
      user: {
        ...profileResponse.data,
        email: emailResponse.data.elements[0]['handle~'].emailAddress,
      },
    });
  } catch (error) {
    console.error('LinkedIn OAuth error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to authenticate with LinkedIn',
      details: error.response?.data || error.message,
    });
  }
});

// All other GET requests will be handled by React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
