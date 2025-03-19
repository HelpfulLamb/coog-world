import React, { useState } from 'react';
import './Register.css';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();

        // Basic Validation
        if (!username || !email || !password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setSuccess('Account successfully created!');
        setError('');

        // Mock registration (for future database integration)
        console.log('New User Details:', { username, email, password });

        // Clear form fields
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="register-page">
            <div className="form">
                <h1>Create an Account</h1>
                <form onSubmit={handleRegister}>
                    {/* Username */}
                    <div className="field-wrap">
                        <input
                            type="text"
                            required
                            autoComplete="off"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={username ? 'filled' : ''}
                        />
                        <label className={username ? 'active' : ''}>
                            Username<span className="req">*</span>
                        </label>
                    </div>

                    {/* Email */}
                    <div className="field-wrap">
                        <input
                            type="email"
                            required
                            autoComplete="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={email ? 'filled' : ''}
                        />
                        <label className={email ? 'active' : ''}>
                            Email<span className="req">*</span>
                        </label>
                    </div>

                    {/* Password */}
                    <div className="field-wrap">
                        <input
                            type="password"
                            required
                            autoComplete="off"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={password ? 'filled' : ''}
                        />
                        <label className={password ? 'active' : ''}>
                            Password<span className="req">*</span>
                        </label>
                    </div>

                    {/* Confirm Password */}
                    <div className="field-wrap">
                        <input
                            type="password"
                            required
                            autoComplete="off"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={confirmPassword ? 'filled' : ''}
                        />
                        <label className={confirmPassword ? 'active' : ''}>
                            Confirm Password<span className="req">*</span>
                        </label>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    <button type="submit" className="button button-block">
                        Register
                    </button>

                    <p className="already-registered">
                        Already have an account? <a href="/login">Login</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
