import React, { useState } from 'react';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignInModal({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleGoogle = () => {
    const clientId = '540624335206-4kof3mqb5sff8tieclrp0abvl6roq4cj.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent('http://localhost:5173/auth/connect');
    const scope = encodeURIComponent('openid email profile');
    const state = encodeURIComponent('login_' + Date.now());
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&access_type=online&prompt=select_account`;
    window.location.href = oauthUrl;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Please enter a valid email.');
      return;
    }
    setSubmitting(true);
    // 模拟请求
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, background: 'rgba(0,0,0,0.24)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{background: '#fff', borderRadius: '2rem', maxWidth: 400, width: '90vw', padding: '2.5rem 2rem 2rem 2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', position: 'relative'}}>
        <button onClick={onClose} style={{position: 'absolute', top: 18, right: 20, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer'}}>&times;</button>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18}}>
          <div style={{fontWeight: 700, fontSize: 30, marginBottom: 6, letterSpacing: 1}}>Welcome</div>
          <div style={{fontSize: 15, color: '#666', marginBottom: 18}}>Log in or Sign up to Continue</div>
        </div>
        <button onClick={handleGoogle} style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#f5f5f5', border: '1px solid #eee', borderRadius: 8, padding: '0.7rem 0', fontSize: 17, fontWeight: 500, color: '#222', marginBottom: 16, cursor: 'pointer'}} disabled={submitting || success}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google" style={{width: 22, height: 22, marginRight: 7, borderRadius: 4}} />
          with Google
        </button>
        <div style={{display: 'flex', alignItems: 'center', margin: '18px 0'}}>
          <div style={{flex: 1, height: 1, background: '#eee'}}></div>
          <span style={{margin: '0 1rem', color: '#aaa', fontSize: 13}}>OR</span>
          <div style={{flex: 1, height: 1, background: '#eee'}}></div>
        </div>
        {success ? (
          <div style={{textAlign: 'center', color: '#3b82f6', fontWeight: 600, fontSize: 17, margin: '2rem 0'}}>Success!<br/>Check your email for the next step.</div>
        ) : (
        <form style={{display: 'flex', flexDirection: 'column', gap: 12}} onSubmit={handleEmailSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{width: '100%', padding: '0.8rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 15, marginBottom: 3}}
            disabled={submitting}
            autoFocus
          />
          {error && <div style={{color: '#e53e3e', fontSize: 13, marginBottom: 2}}>{error}</div>}
          <button
            type="submit"
            style={{width: '100%', background: validateEmail(email) ? '#3b82f6' : '#e9ecef', color: validateEmail(email) ? '#fff' : '#aaa', border: 'none', borderRadius: 8, padding: '0.8rem 0', fontWeight: 600, fontSize: 16, cursor: validateEmail(email) ? 'pointer' : 'not-allowed', transition: 'all 0.2s'}}
            disabled={!validateEmail(email) || submitting}
          >
            {submitting ? 'Submitting...' : 'Continue with Email'}
          </button>
        </form>
        )}
        <div style={{marginTop: 18, fontSize: 12, color: '#888', textAlign: 'center'}}>
          By continuing you agree to the <a href="#" style={{color: '#222', textDecoration: 'underline'}}>Terms of Use</a> and <a href="#" style={{color: '#222', textDecoration: 'underline'}}>Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}

