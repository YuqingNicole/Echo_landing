import axios from 'axios';

const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';

// Get the stored access token
const getAccessToken = () => {
  return localStorage.getItem('linkedin_access_token');
};

// Create axios instance with common config
const createApiClient = () => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('No LinkedIn access token found');
  }
  
  return axios.create({
    baseURL: LINKEDIN_API_BASE,
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': '202304',
    },
  });
};

// Get basic profile information
export const getProfile = async () => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.get('/me', {
      params: {
        projection: '(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching LinkedIn profile:', error);
    // If unauthorized, clear the token
    if (error.response?.status === 401) {
      localStorage.removeItem('linkedin_access_token');
    }
    throw error;
  }
};

// Get email address
export const getEmail = async () => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.get('/emailAddress', {
      params: {
        q: 'members',
        projection: '(elements*(handle~))',
      },
    });
    return response.data.elements[0]['handle~'].emailAddress;
  } catch (error) {
    console.error('Error fetching LinkedIn email:', error);
    throw error;
  }
};

// Get profile picture URL
export const getProfilePicture = async () => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.get('/me', {
      params: {
        projection: '(profilePicture(displayImage~:playableStreams))',
      },
    });
    
    if (response.data.profilePicture && response.data.profilePicture['displayImage~']) {
      const pictureUrls = response.data.profilePicture['displayImage~'].elements;
      if (pictureUrls && pictureUrls.length > 0) {
        // Get the highest resolution image
        return pictureUrls[pictureUrls.length - 1].identifiers[0].identifier;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching LinkedIn profile picture:', error);
    return null;
  }
};

// Share a post
export const sharePost = async (content) => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.post('/ugcPosts', {
      author: `urn:li:person:${localStorage.getItem('linkedin_user_id')}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sharing on LinkedIn:', error);
    throw error;
  }
};

// Get connections count
export const getConnectionsCount = async () => {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.get('/connections', {
      params: {
        q: 'viewer',
        count: 1
      }
    });
    return response.data.paging?.total || 0;
  } catch (error) {
    console.error('Error fetching LinkedIn connections count:', error);
    return 0;
  }
};
