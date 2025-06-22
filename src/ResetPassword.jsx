import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Login.css';

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [notif, setNotif] = useState({ show: false, type: '', message: '' });
  const [showLoginBtn, setShowLoginBtn] = useState(false);
  const token = searchParams.get('token');
  const user = searchParams.get('user');
  const failed = searchParams.get('failed');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotif({ show: false, type: '', message: '' });
    setShowLoginBtn(false);
    try {
      const res = await fetch('http://localhost:3004/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, token, password, failed })
      });
      const data = await res.json();
      if (res.ok) {
        setNotif({ show: true, type: 'success', message: data.message });
        setShowLoginBtn(true);
      } else {
        setNotif({ show: true, type: 'error', message: data.message });
      }
    } catch (err) {
      setNotif({ show: true, type: 'error', message: 'Server error. Please try again.' });
    }
  };

  return (
    <div className="login-container">
      <h2>Reset Password</h2>
      {notif.show && (
        <div className={`notif-popup ${notif.type}`}>{notif.message}</div>
      )}
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          New Password
          <input
          //bisa saja type="password", namun agar bisa melihat password yang dimasukkan, kita gunakan state showPassword
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
            <button
              type="button"
              className="show-hide-btn small"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>        
        <button type="submit" className="login-btn">Reset Password</button>
      </form>
      {showLoginBtn && (
        <button className="login-btn" onClick={() => window.location.href = '/'}>Kembali ke Login</button>
      )}
    </div>
  );
}

export default ResetPassword;
