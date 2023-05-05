import React from 'react';
import { useState } from 'react';
import LoginInput from '../components/logininput';
import { validateEmail, validatePassword } from '../validate';
import { auth, createToken } from '../fire';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import axios from 'axios';

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
    let userId;

    //check if username is used or not
    //if used, set usernameError to 'Username is already taken'
    const checkUsername = async () => {
      const body = {
        username: username
      };
      try {
        const response = await axios.post('/api/checkUsername', body);
        return response;
      } catch {
        console.log("error with server");
      }
    };
    checkUsername().then((response) => {
      if (response.data) {
        setUsernameError('Username is already taken');
        validation = false;
        return;
      } else {
        setUsernameError('');
      }
    });
    


    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setIsBadSignup(false);
        console.log('User signed up:', userCredential.user);
        userId = userCredential.user.uid;
        sendEmailVerification(userCredential.user).then(() => {
          console.log('Email sent');
        }).catch((error) => {
          console.error('Error sending email verification:', error);
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
      
      const serverSubmit= async () => {
        const header = await createToken();
        const body = {
          username: username,
          uid: userId
        };
        try {
          const response = await axios.post('/api/signup', body, header);
          return response;
        } catch {
          console.log("error with server");
        }
      }
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
