import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

export const Logout = (navigate) => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    navigate('/login');
}


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({error: '', success: ''});
    const navigate = useNavigate(); 

    const handleSubmit = async (e, isEmployeeLogin = false) => {
        e.preventDefault();
        if(!email || !password){
            setMessage({error: 'Email and password are required.', success: ''});
            return;
        }
        try {
            const response = await fetch(
                isEmployeeLogin ? '/api/employees/login'
                : '/api/users/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({email, password}),
                }
            );
            const data = await response.json();
            if(response.ok){
                setMessage({success: 'Login Successful!', error: ''});
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userType', isEmployeeLogin ? 'employee': 'user');
                if(isEmployeeLogin){
                    navigate('/employee-dashboard');
                } else {
                    navigate('/');
                }
            } else {
                setMessage({error: data.message || 'Login Failed.', success: ''});
            }
        } catch (error) {
            console.error('Error during login: ', error);
            setMessage({error: 'An error occurred. Please try again.'});
        }
    };

    return (
        <div className="login-container">
            <h1 id="login-title">Login to Your Account</h1>
            <form onSubmit={(e) => handleSubmit(e, false)} className="login-form">
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
                <button type="submit" className="fancy">User Login</button>
                <button type="button" className='fancy employee-login' onClick={(e) => handleSubmit(e, true)}>Employee Login</button>
            </form>
            <p>New User? <Link to={'/registration'}>Register Here</Link></p>
            {message.error && <p className='error-message'>{message.error}</p>}
            {message.success && <p className='success-message'>{message.success}</p>}
        </div>
    );
};

export default Login;