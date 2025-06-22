import { useState, useEffect } from 'react';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [notif, setNotif] = useState({ show: false, type: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotif({ show: false, type: '', message: '' });
    try {
      // Validasi login ke login.js (port 3001)
      const loginRes = await fetch('http://localhost:5137/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password })
      });
      const loginData = await loginRes.json();
      if (loginRes.ok) {
        setNotif({ show: true, type: 'success', message: loginData.message });
        if (onLoginSuccess) setTimeout(onLoginSuccess, 800); // Pindah ke MainPage setelah notifikasi
      } else {
        setNotif({ show: true, type: 'error', message: loginData.message });
      }
    } catch (err) {
      setNotif({ show: true, type: 'error', message: 'Server error. Please try again.' });
    }
  };

  const handleForgot = async () => {
    setNotif({ show: false, type: '', message: '' });
    if (!form.username) {
      setNotif({ show: true, type: 'error', message: 'Masukkan username/email terlebih dahulu.' });
      return;
    }
    try {
      const res = await fetch('http://localhost:3003/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username })
      });
      const data = await res.json();
      if (res.ok) {
        setNotif({ show: true, type: 'info', message: data.message });
      } else {
        setNotif({ show: true, type: 'error', message: data.message });
      }
    } catch (err) {
      setNotif({ show: true, type: 'error', message: 'Failed to send email Reset Password.' });
    }
  };

  useEffect(() => {
    if (notif.show) {
      const timer = setTimeout(() => {
        setNotif({ show: false, type: '', message: '' });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [notif.show]);

  return (
    <>
      <div className="bg-overlay-login" />
      {notif.show && (
        <div className={`notif-popup ${notif.type} ${notif.show ? 'fade-in' : 'fade-out'}`}>{notif.message}</div>
      )}
      <div className="eplc-title">EPLC</div>
      <div className="login-container">
        <h2>Admin EPLC</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Username
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="button"
              className="show-hide-btn small"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </label>
          <button
            type="button"
            className="forget-btn"
            onClick={handleForgot}
          >
            Reset Password?
          </button>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </>
  );
}

export default Login;
