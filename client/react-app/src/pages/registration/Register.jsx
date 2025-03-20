import './Register.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3305/api/user';

function RegisterForm({onAddUser}){
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        phone: '',
        address: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if(!formData.fname) newErrors.fname = 'First name is required';
        if(!formData.lname) newErrors.lname = 'Last name is required';
        if(!formData.email) newErrors.email = 'Email name is required';
        if(!formData.phone) newErrors.phone = 'Phone name is required';
        if(!formData.address) newErrors.address = 'Address name is required';
        if(!formData.address) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // return true if no errors
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(validateForm()){
            axios.post(API_URL, formData).then(response => {
                onAddUser(response.data);
                setFormData({fname: '', lname: '', email: '', phone: '', address: ''});
                setErrors({});
            }).catch(error => {
                console.error('Error adding new user: ', error);
                setErrors({submit: 'Failed to add new user. Please try agian.'});
            });
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            <div>
                <label>First Name</label>
                <input type="text" name='fname' value={formData.fname} onChange={handleChanges} />
                {errors.fname && <span className='error'>{errors.fname}</span>}
            </div>
            <div>
                <label>Last Name</label>
                <input type="text" name='lname' value={formData.lname} onChange={handleChanges} />
                {errors.lname && <span className='error'>{errors.lname}</span>}
            </div>
            <div>
                <label>Email</label>
                <input type="email" name='email' value={formData.email} onChange={handleChanges} />
                {errors.email && <span className='error'>{errors.email}</span>}
            </div>
            <div>
                <label>Phone</label>
                <input type="text" name='phone' value={formData.phone} onChange={handleChanges} />
                {errors.phone && <span className='error'>{errors.phone}</span>}
            </div>
            <div>
                <label>Address</label>
                <input type="text" name='address' value={formData.address} onChange={handleChanges} />
                {errors.address && <span className='error'>{errors.address}</span>}
            </div>
            <div>
                <label>Create Password</label>
                <input type="password" name='password' value={formData.password} onChange={handleChanges} />
                {errors.password && <span className='error'>{errors.password}</span>}
            </div>

            <button type='submit'>Create My Account</button>
            {errors.submit && <span className='error'>{errors.submit}</span>}
        </form>
    );
}

function Register(){
    const [user, setUser] = useState([]);

    useEffect(() => {
        axios.get(API_URL).then(response => setUser(response.data)
    ).catch(error => console.error(error))
    }, []);

    const addUser = (newUser) => {
        setUser([...user, newUser]);
    };

    const deleteUser = (id) => {
        axios.delete(`${API_URL}/${id}`).then(() => {
            setUser(user.filter(user => user._id !== id));
        }).catch(error => console.error(error));
    };

    return (
        <div>
            <h1>User Management</h1>

        </div>
    )
}

export default Register