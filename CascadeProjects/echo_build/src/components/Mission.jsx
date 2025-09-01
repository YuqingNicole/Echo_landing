import React, { useState, useEffect } from 'react';
import missionImg from '../assets/mission-hands.jpg';
import '../styles/mission.css';

export default function Mission() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`mission-container ${isVisible ? 'visible' : ''}`}>
      <section className="mission-hero">
        <div className="mission-image-container">
          <img
            src={missionImg}
            alt="Hands with string connection"
            className="mission-image"
          />
        </div>
        <div className="mission-heading-container">
          <h2 className="mission-heading">At the heart of echo.</h2>
        </div>
      </section>
      <ValueSection />
    </div>
  );
}

function ValueSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const values = [
    {
      num: '01',
      title: 'Authenticity',
      desc: 'We share — never hide — our words, actions, and intentions.',
    },
    {
      num: '02',
      title: 'Courage',
      desc: 'Breakthroughs require a willingness to take risks and embrace lofty goals and tough challenges.',
    },
    {
      num: '03',
      title: 'Empathy',
      desc: 'We\'re all humans first. So we deeply consider the perspectives of others, listen openly, and speak with care.',
    },
  ];

  return (
    <section className="values-section">
      <div className="values-container">
        {values.map((value, index) => (
          <div 
            key={index} 
            className={`value-card ${index === activeIndex ? 'active' : ''}`}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <div className="value-number">{value.num}</div>
            <div className="value-content">
              <h3 className="value-title">{value.title}</h3>
              <p className="value-desc">{value.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


