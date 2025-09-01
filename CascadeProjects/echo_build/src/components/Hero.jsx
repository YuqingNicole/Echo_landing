import React from 'react';

import EchoAnimation from './EchoAnimation';

export default function Hero() {
  return (
    <section style={{padding: '4rem 0 2rem 0', textAlign: 'center', background: '#f8fafc', fontFamily: 'Poppins, sans-serif'}}>
      <h1 style={{fontSize: '2.6rem', fontWeight: 700, marginBottom: '1.2rem'}}>Become a Better You</h1>
      <EchoAnimation />
      <p style={{fontSize: '1.2rem', color: '#555', maxWidth: 500, margin: '0 auto 2rem auto'}}>
        A value-driven social and team-up platform. Discover like-minded friends through game cards and voice agent chats.
      </p>
      <a href="#cta" style={{padding: '0.8rem 2.2rem', background: '#5f2d5c', color: '#fff', borderRadius: '2rem', fontWeight: 500, textDecoration: 'none', fontSize: '1.1rem'}}>Get Started</a>
    </section>
  );
}
