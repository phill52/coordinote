import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/loginpage';
import NewEvent from './pages/newEvent';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { auth,createToken } from './fire';
import SignupPage from './pages/signuppage';
import EmailVerificationLanding from './pages/emailVerification';
import ResponseToInvite from './pages/responseToInvite';
import Homepage from './pages/homepage';
import AuthContext from './AuthContext';
import MyEvents from './pages/MyEvents';
import Profile from './pages/userProfile';
import axios from 'axios';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);
  useEffect(() => { //firebase useEffect
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setLoadingUser(false);
    });
  
    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => { //mongo useEffect
    const checkUser = async () => {
      let header=await createToken();
      let data;
      if (currentUser) {
        try{
          if(window.location.hostname==='localhost'){
          data = await axios.get('http://localhost:3001/api/fireuser',{headers:{'Content-Type':'application/json', authorization:header.headers.Authorization}});
          }
          else{
            data = await axios.get('https://coordinote.us/api/fireuser',{headers:{'Content-Type':'application/json', authorization:header.headers.Authorization}})
          }
          setMongoUser({
            username: data.data.username,
            _id: data.data._id,
          });
        }
        catch(e){
          console.log(e);
        }
      }
    }
    checkUser();
  }, [currentUser]);

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
    <AuthContext.Provider value={{currentUser, setCurrentUser, mongoUser}}>
    <Router className='router'>
    <div className="App">
      <header className='App-header'>
        <p>Hello</p>
        <Link to='/newEvent'>New Event</Link>
        <Link to='/'>Home</Link>
        <Link to='/login'>Login</Link>
        <Link to='/signup'>Sign Up</Link>
        {/* <Link to='/event/644ddc19c0db45afd6c996ed' uid={currentUser.uid}>Event (temporary)</Link> */}
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
          <Route path='/*' element={<p>404 not found</p>}></Route> {/* TODO: make a 404 page */}
          {/* <Route path='/myEvent/:uId' element={<MyEvents />} /> */}
          <Route path='/createdEvents' element={<ProtectedRoute Component={<MyEvents invited={false}/>}/>}/>
          <Route path='/invitedEvents' element={<ProtectedRoute Component={<MyEvents invited={true}/>}/>}/>
          <Route path='/user/:id' Component={Profile}/>4
        </Routes>
      </div>
    </div>
    </Router>
  </AuthContext.Provider>
  );
}

export default App;
