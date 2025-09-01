import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import Mission from './components/Mission';
import Profile from './components/Profile';

function Home() {
  return <>
    <Hero />
    <Features />
  </>;
}
// Profile component has been moved to a separate file
function Connect() {
  return <div style={{padding: '4rem 0 3rem 0', textAlign: 'center'}}>Connect Page</div>;
}

function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'Poppins, Helvetica Neue, Arial, sans-serif' }}>
        <TopBar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/mission" element={<Mission />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);