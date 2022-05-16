import React, { useState, useRef } from 'react';
import { Room, Cancel } from '@mui/icons-material';
import axios from 'axios';
import './register.css';

export default function Register({ setShowRegister }) {
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerFailure, setRegisterFailure] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value
    };

    try {
      await axios.post('api/users/register', newUser);
      setRegisterFailure(false);
      setRegisterSuccess(true);
    } catch(e) {
      setRegisterFailure(true);
    }
  }

  return (
    <div className='register-container'>
      <div className='logo'>
        <Room />
        GriffPin
      </div>
      
      <form onSubmit={handleRegisterSubmit}>
        <input type='text' placeholder='Username' ref={nameRef} />
        <input type='email' placeholder='Email' ref={emailRef} />
        <input type='password' placeholder='Password' ref={passwordRef} />
        <button type='submit'className='register-submit'>Register</button>
        
        {registerSuccess && (
          <span className='success'><b>Success!</b> You can now login.</span>
        )}
        {registerFailure && (
          <span className='failure'><b>Error!</b> Could not register.</span>
        )}
      </form>
      <Cancel className='register-cancel' onClick={() => setShowRegister(false)}/>
    </div>
  );
};