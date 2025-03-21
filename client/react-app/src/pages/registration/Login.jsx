import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = (e) => {
        e.preventDefault();
  
        console.log('Username:', username);
        console.log('Password:', password);

        
        navigate('/dashboard'); 
    };

    return (
        <div className="login-container">
            <h1 id="login-title">Login to Your Account</h1>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username" 
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
        </div>
    );
};

export default Login;