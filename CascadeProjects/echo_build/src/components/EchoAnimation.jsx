import React from 'react';

export default function EchoAnimation() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '320px', position: 'relative', margin: '2rem 0'
    }}>
      <div className="echo-rings">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="echo-ring" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>
      <style>{`
        .echo-rings {
          position: relative;
          width: 320px;
          height: 320px;
        }
        .echo-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(40,40,60,0.22);
          transform: translate(-50%, -50%) scale(1);
          animation: echo-pulse 2.2s cubic-bezier(0.4,0,0.2,1) infinite;
        }
        .echo-ring:nth-child(2) { width: 170px; height: 170px; background: rgba(40,40,60,0.18); }
        .echo-ring:nth-child(3) { width: 220px; height: 220px; background: rgba(40,40,60,0.14); }
        .echo-ring:nth-child(4) { width: 270px; height: 270px; background: rgba(40,40,60,0.10); }
        .echo-ring:nth-child(5) { width: 320px; height: 320px; background: rgba(40,40,60,0.07); }
        @keyframes echo-pulse {
          0% { transform: translate(-50%, -50%) scale(0.92); opacity: 1; }
          70% { opacity: 0.7; }
          100% { transform: translate(-50%, -50%) scale(1.15); opacity: 0; }
        }
      `}</style>
    </div>
  );
}