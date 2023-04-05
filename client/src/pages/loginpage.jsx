import React from 'react';
import { useState } from 'react';
import LoginInput from '../components/logininput';
import { validateEmail } from '../validate';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleEmailChange = async (value) => {
    setEmail(value);
  };
  const handlePasswordChange = async (value) => {
    setPassword(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email==='') {
      setEmailError('Email is required');
    } else {
      setEmailError('');
    }
    if (password==='') {
      setPasswordError('Password is required');
    } else {
      setPasswordError('');
    }
    if (!validateEmail(email)) {
      setEmailError('Must be email format.');
    } else {
      setEmailError('');
    }
    
    // Backend people now send email and password to server for authentication and do something.
    console.log('logged in i guess?');
  };

  return (
    <div className='Login-page'>
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="email" className={`login-label ${emailError.length>0 ? 'error' : ''}`}>Email:</label>
          <LoginInput for="email" onChange={handleEmailChange} value={email}/>
          <p className="input-error-message">{emailError}</p>
        <label htmlFor="password" className="login-label">Password:</label>
          <LoginInput for="password" onChange={handlePasswordChange} value={password}/>
        <div className="flex justify-center">
          <button type="submit" onClick={handleSubmit}>Log in</button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;