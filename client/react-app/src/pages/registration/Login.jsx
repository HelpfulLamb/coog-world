import React, { useState } from 'react';
import './Login.css';

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'test' && password === 'password123') {
      localStorage.setItem('token', 'your_token_here'); // Simulated auth
      setIsAuthenticated(true);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-page">
      <div className="form">
        <h1>Welcome Back!</h1>
        <form onSubmit={handleLogin}>
          <div className="field-wrap">
            <input
              type="text"
              required
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={username ? 'filled' : ''}
            />
            <label className={username ? 'active' : ''}>Username<span className="req">*</span></label>
          </div>

          <div className="field-wrap">
            <input
              type="password"
              required
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={password ? 'filled' : ''}
            />
            <label className={password ? 'active' : ''}>Password<span className="req">*</span></label>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="button button-block">Log In</button>

          <p className="forgot">
            <a href="#">Forgot Password?</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;