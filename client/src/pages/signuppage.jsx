import React from 'react';
import { useState } from 'react';
import LoginInput from '../components/logininput';
import { validateEmail, validatePassword } from '../validate';
import { auth } from '../fire';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isBadSignup, setIsBadSignup] = useState(false);
  const [badSignupMessage, setBadSignupMessage] = useState('');

  const handleEmailChange = (value) => {
    setEmail(value);
  };
  const handlePasswordChange = (value) => {
    setPassword(value);
  };
  const handleUsernameChange = (value) => {
    setUsername(value);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    let validation = true;

    if (email === '') {
      setEmailError('Email is required');
      validation = false;
    } else {
      setEmailError('');
    }

    if (password === '') {
      setPasswordError('Password is required');
      validation = false;
    } else {
      setPasswordError('');
    }

    if (username === '') {
      setUsernameError('Username is required');
      validation = false;
    } else {
      setUsernameError('');
    }

    if (!validateEmail(email)) {
      setEmailError('Must be email format.');
      validation = false;
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      setPasswordError('Must be 6-20 characters, one number, one lowercase, one uppercase, and one special character.');
      validation = false;
    } else {
      setPasswordError('');
    }
    if (!validation) return;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setIsBadSignup(false);
        console.log('User signed up:', userCredential.user);
        sendEmailVerification(userCredential.user).then(() => {
          console.log('Email sent');
        });

      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        setIsBadSignup(true);
        switch (errorCode) {
          case 'auth/email-already-in-use':
            setBadSignupMessage('Email already in use.');
        }
        console.log(errorCode, errorMessage);
      });

      


    };

    return (
      <div className='Login-page'>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="username" className={`login-label ${usernameError.length>0 ? 'error' : ''}`}>Username:</label>
            <LoginInput for="username" onChange={handleUsernameChange} value={username}/>
            <p className="input-error-message">{usernameError}</p>
  
          <label htmlFor="email" className={`login-label ${emailError.length>0 ? 'error' : ''}
          ${isBadSignup ? 'error' : ''}
          `}>Email:</label>
            <LoginInput for="email" onChange={handleEmailChange} value={email}/>
            <p className="input-error-message">{emailError}</p>
            
          <label htmlFor="password" className={`login-label
          ${isBadSignup ? 'error' : ''}`}>Password:</label>
            <LoginInput for="password" onChange={handlePasswordChange} value={password}/>
            <p className="input-error-message">{passwordError}</p>
            
          <div className="flex justify-center">
            <button type="submit" onClick={handleSubmit}>Sign up</button>
          </div>
          {isBadSignup && <p className="input-error-message">{badSignupMessage}</p>}
        </form>
      </div>
    );
  };

export default SignupPage;
