import React from 'react';

export default function CTA() {
  return (
    <section id="cta" style={{padding: '3rem 0', background: '#3b82f6', color: '#fff', textAlign: 'center', fontFamily: 'Poppins, sans-serif'}}>
      <h2 style={{fontSize: '2rem', fontWeight: 600, marginBottom: '1.2rem'}}>Join the Waitlist & Be First to Try!</h2>
      <form style={{display: 'inline-flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center'}}>
        <input type="email" placeholder="Enter your email" required style={{padding: '0.7rem 1rem', borderRadius: '2rem', border: 'none', outline: 'none', fontSize: '1rem', minWidth: '220px'}} />
        <button type="submit" style={{padding: '0.7rem 1.8rem', borderRadius: '2rem', border: 'none', background: '#fff', color: '#3b82f6', fontWeight: 600, fontSize: '1rem', cursor: 'pointer'}}>Submit</button>
      </form>
    </section>
  );
}