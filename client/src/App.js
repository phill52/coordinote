import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/loginpage';
import NewEvent from './pages/newEvent';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { auth } from './fire';
import SignupPage from './pages/signuppage';

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      return user ? setLoggedIn(true) : setLoggedIn(false);
    });

    // Cleanup function
    return () => {
      unsubscribe();
    };
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
  
  return (
    <Router className='router'>
    <div className="App">
      {!loggedIn ?<>
          <header className='App-header'>
            <p>Hello</p>
            <Link to='/newEvent'>New Event</Link>
            <Link to='/'>Home</Link>
            <Link to='/login'>Login</Link>
            <Link to='/signup'>Sign Up</Link>
          </header>
          <div className='App-body'>
            <Routes>
              <Route path='/newEvent' element={<LoginPage />}/>
              <Route path='/login' element={<LoginPage />} />
              <Route path='/signup' element={<SignupPage />} />
            </Routes>
          </div>
      </> : 
      <>
        <header className='App-header'>
          <p>Hello</p>
          <Link to='/newEvent'>New Event</Link>
          <Link to='/'>Home</Link>
          <div onClick={signOut}>Sign Out</div>
        </header>
        <div className='App-body'>
            <Routes>
              <Route path='/newEvent' element={<NewEvent />}/>
              <Route path='/login' element={<LoginPage />} />
            </Routes>
        </div>
      </>}
    </div>
    </Router>
  );
}

export default App;
