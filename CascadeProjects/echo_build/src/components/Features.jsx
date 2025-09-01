import React from 'react';

const features = [
  {
    title: 'Value Match',
    desc: 'Discover your true self and find like-minded friends through deep questions and voice conversations.',
  },
  {
    title: 'Gamified Cards',
    desc: 'Express yourself easily and break the ice with fun card interactions.',
  },
  {
    title: 'Voice Agent',
    desc: 'AI voice assistant for deep self-exploration and meaningful conversations.',
  },
  {
    title: 'Team Up & Grow',
    desc: 'Find teammates, grow together, and embark on new adventures.',
  },
];

export default function Features() {
  return (
    <section id="features" style={{padding: '3rem 0', background: '#fff', fontFamily: 'Poppins, sans-serif'}}>
      <h2 style={{textAlign: 'center', fontSize: '2rem', fontWeight: 600, marginBottom: '2rem'}}>Features</h2>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem'}}>
        {features.map((f, i) => (
          <div key={i} style={{background: '#f1f5f9', borderRadius: '1.2rem', padding: '2rem', width: '260px', boxShadow: '0 2px 8px #e5e7eb'}}>
            <h3 style={{fontSize: '1.2rem', fontWeight: 500, marginBottom: '0.7rem'}}>{f.title}</h3>
            <p style={{fontSize: '1rem', color: '#555'}}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
