import React from 'react';

export default function Header() {
  return (
    <header style={{padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Poppins, sans-serif'}}>
      <div style={{fontWeight: 'bold', fontSize: '1.4rem'}}>Echo</div>
      <nav>
        <a href="#features" style={{marginRight: '1.5rem'}}>Features</a>
        <a href="#cta">Get Started</a>
      </nav>
    </header>
  );
}