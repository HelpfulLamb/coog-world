import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import './Register.css';
import { useAuth } from '../../context/AuthContext.jsx';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        street: '',
        city: '',
        state: '',
        zipCode: ''
    });
    const [message, setMessage] = useState({ error: '', success: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { setUser, setIsAuthenticated } = useAuth();

    const handleChange = (e) => {
        const {name, value} = e.target;
        if(name === 'phone'){
            const digits = value.replace(/\D/g, '');
            let formatted = digits;
            if (digits.length >= 4 && digits.length <= 6) {
                formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
            } else if (digits.length > 6) {
                formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} - ${digits.slice(6, 10)}`;
            }
            setFormData({...formData, [name]: formatted});
            return;
        }
        setFormData({ ...formData, [name]: value });
    };
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        const {first_name, last_name, email, phone, password, confirmPassword, street, city, state, zipCode} = formData;
        if (!first_name || !last_name || !email || !password || !phone || !confirmPassword || !street || !city || !state || !zipCode) {
            setMessage({ error: 'All fields are required.', success: '' });
            return;
        }
        if (password.length < 6) {
            setMessage({ error: 'Password must be at least 6 characters long.', success: '' });
            return;
        }
        if (password !== confirmPassword) {
            setMessage({ error: 'Passwords do not match.', success: '' });
            return;
        }
        const rawphone = formData.phone.replace(/\D/g, '');
        const fullAddress = `${street},${city},${state},${zipCode}`;
        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name,
                    last_name,
                    email,
                    phone: rawphone,
                    password,
                    confirmPassword,
                    address: fullAddress
                }),
            });
            const data = await response.json();
            // Once the user registers, they will be auto logged in and redirected to their profile
            if (response.ok) {    
                setMessage({ success: 'Account successfully created!', error: '' });
                const loginResponse = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const loginData = await loginResponse.json();

                if (loginResponse.ok) {
                    localStorage.setItem('user', JSON.stringify(loginData));
                    setUser(loginData);
                    setIsAuthenticated(true);
                
                    setFormData({
                        first_name: '',
                        last_name: '',
                        email: '',
                        phone: '',
                        password: '',
                        confirmPassword: '',
                        street: '',
                        city: '',
                        state: '',
                        zipCode: ''
                    });
                
                    navigate('/profile');
                } else {
                    setMessage({ error: loginData.message || 'Login failed after registration.', success: '' });
                }
            } else {
                setMessage({ error: data.message || 'Registration failed.', success: '' });
            }
        } catch (error) {
            setMessage({ error: 'An error occurred. Please try again.', success: '' });
        }
    };
    const states = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
    return (
        <div className="register-page">
            <div className="form">
                <h1 className="register-header">Create an Account</h1>
                <form onSubmit={handleRegister}>
                    <div className="field-row">
                        <div className="field-wrap">
                            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                            <label>First Name<span className="req">*</span></label>
                        </div>
                        <div className="field-wrap">
                            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                            <label>Last Name<span className="req">*</span></label>
                        </div>
                    </div>
                    <div className="field-wrap">
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        <label>Email<span className="req">*</span></label>
                    </div>
                    <div className="field-wrap">
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                        <label>Phone<span className="req">*</span></label>
                    </div>
                    <div className="field-wrap">
                        <input type="text" name="street" value={formData.street} onChange={handleChange} required />
                        <label>Street Address<span className="req">*</span></label>
                    </div>
                    <div className="field-row">
                        <div className="field-wrap">
                            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                            <label>City<span className="req">*</span></label>
                        </div>
                        <div className="field-wrap">
                            <select name="state" value={formData.state} onChange={handleChange} required>
                                <option value="">---</option>
                                {states.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                            <label>State<span className="req">*</span></label>
                        </div>
                        <div className="field-wrap">
                            <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                            <label>Zip Code<span className="req">*</span></label>
                        </div>
                    </div>
                    <div className="field-wrap password-wrap">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required />
                        <label>Password<span className="req">*</span></label>
                        <span className='eye-icon' onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <div className="field-wrap password-wrap">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required />
                        <label>Confirm Password<span className="req">*</span></label>
                        <span className='eye-icon' onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {message.error && <p className="error-message">{message.error}</p>}
                    {message.success && <p className="success-message">{message.success}</p>}
                    <div className="register-button">
                        <button type="submit">Register</button>
                    </div>
                </form>
                <p className="already-registered">Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
}

export default Register;