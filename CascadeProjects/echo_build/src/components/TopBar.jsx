import React, { useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { key: 'home', label: 'Home', path: '/home' },
  { key: 'mission', label: 'Mission', path: '/mission' },
  { key: 'profile', label: 'Profile', path: '/profile' },
  { key: 'connect', label: 'Connect', path: '/connect' },
];

import SignInModal from './SignInModal';

export default function TopBar() {
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <nav className="topbar-fixed" style={{background: '#fff', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.03)', width: '100%', padding: '0.7rem 0'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.98rem', width: '100%'}}>
          <div style={{display: 'flex', gap: '2.5vw', alignItems: 'center', justifyContent: 'center', flex: 1}}>
            {tabs.map(tab => {
              const isActive = location.pathname === tab.path;
              return (
                <div
                  key={tab.key}
                  className={`topbar-tab${isActive ? ' active' : ''}`}
                  onClick={() => navigate(tab.path)}
                  style={{fontSize: '0.95em', cursor: 'pointer'}}>
                  <span>{tab.label}</span>
                  {isActive && <span className="topbar-dot" />}
                </div>
              );
            })}
          </div>
          <button onClick={() => setModalOpen(true)} style={{marginLeft: '2vw', padding: '0.4rem 1.1rem', borderRadius: '2rem', border: 'none', background: '#5f2d5c', color: '#fff', fontWeight: 500, fontSize: '0.97rem', cursor: 'pointer'}}>Sign In</button>
        </div>
      </nav>
      <SignInModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
