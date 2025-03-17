import './Register.css';
import { useState } from 'react';

function Register(){
    return (
        <>
            <h2 id='registration-title'>Registration Form</h2>
            <form className='form-registry'>
                <label>First Name</label>
                <input type="text" placeholder='firstname' />
                <label>Last Name</label>
                <input type="text" placeholder='lastname' />
                <label>Email</label>
                <input type="email" placeholder='example@email.com' />
                <label>Address</label>
                <input type="text" />
                <label>Password</label>
                <input type="Password" />
            </form>
        </>
    )
}

export default Register