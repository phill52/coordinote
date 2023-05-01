import React from 'react';
import { useState } from 'react';
import LoginInput from '../components/logininput';
import { validateEmail } from '../validate';
import { auth } from '../fire';
import { signInWithEmailAndPassword } from 'firebase/auth';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isBadLogin, setIsBadLogin] = useState(false);

  const handleEmailChange = async (value) => {
    setEmail(value);
  };
  const handlePasswordChange = async (value) => {
    setPassword(value);
  };

  const handleSubmit = (event) => {
    let validation=true;
    event.preventDefault();
    if (email==='') {
      setEmailError('Email is required');
      validation=false;
    } else {
      setEmailError('');
    }
    if (password==='') {
      setPasswordError('Password is required');
      validation=false;
    } else {
      setPasswordError('');
    }
    if (!validateEmail(email)) {
      setEmailError('Must be email format.');
      validation=false;

    } else {
      setEmailError('');
    }
    if (!validation) return;
    // Backend people now send email and password to server for authentication and do something.
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials)=> {
        console.log(userCredentials.user.accessToken);
        fetch('/login', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + userCredentials.user.accessToken,
            'Content-Type': 'application/json'
          }
        })
        console.log('logged in');
        setIsBadLogin(false);
      }).
      catch((error)=>{
        var errorCode = error.code;
        var errorMessage = error.message;
        setIsBadLogin(true);
        console.log(errorCode, errorMessage);
      })
    console.log('logged in i guess?');
  };

  return (
    <div className='Login-page'>
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="email" className={`login-label ${emailError.length>0 ? 'error' : ''}
        ${isBadLogin ? 'error' : ''}
        `}>Email:</label>
          <LoginInput for="email" onChange={handleEmailChange} value={email}/>
          <p className="input-error-message">{emailError}</p>
        <label htmlFor="password" className={`login-label
        ${isBadLogin ? 'error' : ''}`}>Password:</label>
          <LoginInput for="password" onChange={handlePasswordChange} value={password}/>
          <p className="input-error-message">{passwordError}</p>
        <div className="flex justify-center">
          <button type="submit" onClick={handleSubmit}>Log in</button>
        </div>
        {isBadLogin && <p className="input-error-message">Incorrect email or password.</p>}
      </form>
    </div>
  );
};

export default LoginPage;