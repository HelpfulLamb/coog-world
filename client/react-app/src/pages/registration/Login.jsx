import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx'; 
import './Login.css';

export const Logout = (navigate) => {
    localStorage.removeItem('user');            // ✅ clear saved user object
    localStorage.removeItem('isAuthenticated'); // ✅ optional flag
    localStorage.removeItem('userType');        // ✅ optional if you're using it
    navigate('/login');                         // ✅ redirect to login
};


const Login = () => {
    const { setIsAuthenticated } = useAuth();
    const [role, setRole] = useState(null); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ error: '', success: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated');
        if (authStatus === 'true') {
            setIsAuthenticated(true);
            navigate('/');
        }
    }, [navigate, setIsAuthenticated]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setMessage({ error: 'Email and password are required.', success: '' });
            return;
        }

        try {
            const response = await fetch(
                role === 'employee' ? '/api/employees/login' 
                                    : '/api/users/login',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await response.json();
            console.log("Logged in user data:", data);
            if (response.ok) {
                setMessage({ success: 'Login Successful!', error: '' });
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userType', role);
                localStorage.setItem('user', JSON.stringify(data)); // ✅ Saves user data
            
                console.log("Saved to localStorage:", localStorage.getItem('user')); // ✅ Add this line here
            
                setIsAuthenticated(true); 
            
                // Redirect based on role
                navigate(role === 'user' ? '/profile' : '/employee-dashboard');
            }
            
             else {
                setMessage({ error: data.message || 'Login Failed.', success: '' });
            }
        } catch (error) {
            console.error('Error during login:', error);
            setMessage({ error: 'An error occurred. Please try again.' });
        }
    };

    return (
        <div className="login-container">
            <h1 id="login-title">Login to Your Account</h1>

            {!role ? (
                <div className="role-selection">
                    <button className="fancy" onClick={() => setRole('user')}>User Login</button>
                    <button className="fancy employee-login" onClick={() => setRole('employee')}>Employee Login</button>
                </div>
            ) : (
                <>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                            />
                        </div>
                        <button type="submit" className="fancy">Login</button>
                    </form>
                    
                    <button className="back-button" onClick={() => setRole(null)}>← Back</button>
                </>
            )}

            {!role && <p>New User? <Link to={'/registration'}>Register Here</Link></p>}
            {message.error && <p className='error-message'>{message.error}</p>}
            {message.success && <p className='success-message'>{message.success}</p>}
        </div>
    );
};

export default Login;