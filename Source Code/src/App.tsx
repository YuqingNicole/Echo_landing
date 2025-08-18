import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GameTests from './pages/GameTests';
import ProfileEdit from './pages/ProfileEdit';
import AgentChat from './pages/AgentChat';
import FindMatches from './pages/FindMatches';


interface UserInfo {
  encrypted_yw_id: string;
  display_name?: string;
  photo_url?: string;
}

function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        console.log('🔍 Fetching user info from backend...');
        const response = await fetch('https://backend.youware.com/__user_info__');
        const result = await response.json();
        
        console.log('✅ User info response:', result);

        if (result.code === 0 && result.data) {
          setUserInfo(result.data);
        }
      } catch (error) {
        console.error('❌ Failed to fetch user info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<LandingPage userInfo={userInfo} />} />
          <Route path="/tests" element={<GameTests userInfo={userInfo} />} />
          <Route path="/profile" element={<ProfileEdit userInfo={userInfo} />} />
          <Route path="/chat" element={<AgentChat userInfo={userInfo} />} />
          <Route path="/matches" element={<FindMatches userInfo={userInfo} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;