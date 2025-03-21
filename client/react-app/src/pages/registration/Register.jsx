import React, { useState } from 'react';
import './Register.css';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ error: '', success: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const { username, email, password, confirmPassword } = formData;

        // Basic Validation
        if (!username || !email || !password || !confirmPassword) {
            setMessage({ error: 'All fields are required.', success: '' });
            return;
        }

        if (password !== confirmPassword) {
            setMessage({ error: 'Passwords do not match.', success: '' });
            return;
        }

        if (password.length < 6) {
            setMessage({ error: 'Password must be at least 6 characters long.', success: '' });
            return;
        }

        setMessage({ success: 'Account successfully created!', error: '' });
        console.log('New User Details:', formData);
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    };

    return (
        <div className="register-page">
            <div className="form">
                <h1>Create an Account</h1>
                <form onSubmit={handleRegister}>
                    {['username', 'email', 'password', 'confirmPassword'].map((field, index) => (
                        <div className="field-wrap" key={index}>
                            <input
                                type={field.includes('password') ? 'password' : 'text'}
                                name={field}
                                required
                                autoComplete="off"
                                value={formData[field]}
                                onChange={handleChange}
                                className={formData[field] ? 'filled' : ''}
                            />
                            <label className={formData[field] ? 'active' : ''}>
                                {field.charAt(0).toUpperCase() + field.slice(1)}<span className="req">*</span>
                            </label>
                        </div>
                    ))}
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <button type="submit" className="button button-block">Register</button>
                    <p className="already-registered">
                        Already have an account? <a href="/login">Login</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;