import { useState, useRef } from 'react';
import { Room, Cancel } from '@mui/icons-material';
import axios from 'axios';
import './login.css';

export default function Login({ setShowLogin, setCurrentUser, storage }) {
  const [loginFailure, setLoginFailure] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value
    };

    try {
      const res = await axios.post('api/users/login', user);
      storage.setItem('user', res.data.username);
      setLoginFailure(false);
      setCurrentUser(res.data.username);
      setShowLogin(false);
    } catch(e) {
      setLoginFailure(true);
    }
  };


  return (
    <div className='login-container'>
      <div className='logo'>
        <Room />
        GriffPin
      </div>
      
      <form onSubmit={handleLoginSubmit}>
        <input type='text' placeholder='Username' ref={nameRef} />
        <input type='password' placeholder='Password' ref={passwordRef} />
        <button type='submit'className='login-submit'>Login</button>
        
        {loginFailure && (
          <span className='failure'><b>Error!</b> Could not login.</span>
        )}
      </form>

      <Cancel className='login-cancel' onClick={() => setShowLogin(false)}/>
    </div>
  );
};