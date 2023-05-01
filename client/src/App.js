import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/loginpage';
import NewEvent from './pages/newEvent';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { auth } from './fire';
import SignupPage from './pages/signuppage';
import EmailVerificationLanding from './pages/emailVerification';
import ResponseToInvite from './pages/responseToInvite';
import Homepage from './pages/homepage';
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoadingUser(false);
    });
  }, []);

  const signOut = () => {
    auth.signOut()
  };

  if (loadingUser) {
    return (  
      <div>
        <h1>Loading....</h1>
      </div>
    );
  }

  const emailVerified = currentUser && currentUser.emailVerified;
  const ProtectedRoute = ({Component}) => {
      
    if (!currentUser) {
      return <Navigate to="/login"/>;
    }
    else if (emailVerified) { 
      return Component;
    } else {
      return <Navigate to="/email-verification"/>;
    }
  };

  const UnloggedRoute = ({Component}) => {
    console.log(currentUser)
    if (currentUser===null) {
      return Component;
    } else {
      return <Navigate to="/"/>;
    }
  }
  
  return (
    <Router className='router'>
    <div className="App">
      <header className='App-header'>
        <p>Hello</p>
        <Link to='/newEvent'>New Event</Link>
        <Link to='/'>Home</Link>
        <Link to='/login'>Login</Link>
        <Link to='/signup'>Sign Up</Link>
        <Link to='/event/644ddc19c0db45afd6c996ed' uid={currentUser}>Event (temporary)</Link>
        <button onClick={signOut}>Sign Out</button>
      </header>
      <div className='App-body'>
        <Routes>
          <Route path='/newEvent' element={<ProtectedRoute Component={<NewEvent/>}/> }/>
          <Route path='/login' element={<UnloggedRoute Component={<LoginPage />}/>} />
          <Route path='/signup' element={<UnloggedRoute Component={<SignupPage/>}/>} />
          <Route path='/email-verification' element={<EmailVerificationLanding/>} />
          <Route path='/event/:id' element={<ResponseToInvite />} />
          <Route path='/' element={<Homepage />} />
        </Routes>
      </div>
    </div>
    </Router>
  );
}

export default App;
