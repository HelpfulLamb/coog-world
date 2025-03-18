import React, { useState } from 'react';
import './Login.css';

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login'); // Track active tab

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'test' && password === 'password123') {
      localStorage.setItem('token', 'your_token_here');
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="form">
      {/* Tab Navigation */}
      <ul className="tab-group">
        <li className={`tab ${activeTab === 'login' ? 'active' : ''}`}>
          <a
            href="#login"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('login');
            }}
          >
            Log In
          </a>
        </li>
        <li className={`tab ${activeTab === 'signup' ? 'active' : ''}`}>
          <a
            href="#signup"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('signup');
            }}
          >
            Sign Up
          </a>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Login Form */}
        {activeTab === 'login' && (
          <div id="login" className="active">
            <h1>Welcome Back!</h1>
            <form onSubmit={handleLogin}>
              <div className="field-wrap">
                <label className={username ? 'active' : ''}>
                  Username<span className="req">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="field-wrap">
                <label className={password ? 'active' : ''}>
                  Password<span className="req">*</span>
                </label>
                <input
                  type="password"
                  required
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="button button-block">
                Log In
              </button>
            </form>
          </div>
        )}

        {/* Sign Up Form */}
        {activeTab === 'signup' && (
          <div id="signup" className="active">
            <h1>Sign Up for Free</h1>
            <form action="/" method="post">
              <div className="field-wrap">
                <label className="active">First Name<span className="req">*</span></label>
                <input type="text" required autoComplete="off" />
              </div>

              <div className="field-wrap">
                <label className="active">Last Name<span className="req">*</span></label>
                <input type="text" required autoComplete="off" />
              </div>

              <div className="field-wrap">
                <label className="active">Email Address<span className="req">*</span></label>
                <input type="email" required autoComplete="off" />
              </div>

              <div className="field-wrap">
                <label className="active">Set A Password<span className="req">*</span></label>
                <input type="password" required autoComplete="off" />
              </div>

              <button type="submit" className="button button-block">
                Get Started
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
