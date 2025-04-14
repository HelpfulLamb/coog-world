import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx'; 
import './Login.css';

// Login.jsx
export const Logout = (navigate) => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    window.location.href = '/login'; // full reload to clear memory
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
            const endpoint = role === 'employee' ? '/api/employees/login' : '/api/users/login';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            console.log("Logged in user data:", data);
            if (response.ok) {
                setMessage({ success: 'Login Successful!', error: '' });
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userType', role);
                localStorage.setItem('user', JSON.stringify(data)); // Saves user data
                //console.log("Saved to localStorage:", localStorage.getItem('user'));
                setIsAuthenticated(true);
                if(role === 'user'){
                    navigate('/profile');
                } else if(role === 'employee'){
                    const userRole = data.role?.toLowerCase();
                    if(userRole === 'admin') {
                        navigate('/employee-dashboard');  // change to admin dashboard
                    } else if (userRole === 'manager') {
                        navigate('/employee-dashboard');  // change to manager dashboard
                    } else if(userRole === 'maintenance') {
                        navigate('/employee-dashboard');  // change to maintenance dashboard
                    } else {
                        navigate('/employee-dashboard');  // change to employee dashboard
                    }
                }
            } else {
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