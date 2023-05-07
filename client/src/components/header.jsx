import React from 'react';
import { useState, useEffect } from 'react';
import { auth, createToken } from '../fire';
import AuthContext from '../AuthContext';
import {Link} from 'react-router-dom';

const Header = () => {
  const {mongoUser, currentUser, loadingMongo} = React.useContext(AuthContext);
  const signOut = () => {
    auth.signOut()
    window.location.reload(false)
  };

  if (currentUser&&loadingMongo){
    return (
      <header className='header'>
        <p>...</p>
      </header>
    )
  }
  console.log("MONGO USER", mongoUser)

  if (currentUser) {
  return (
    <header className='header'>
        <Link to='/' className='text-3xl transition duration-300 transform hover:scale-110 font-bold'>CoordiNote</Link>
        <Link to='/newEvent'>New Event</Link>
        <Link to='/createdEvents'>My Events</Link>
        <Link to='/invitedEvents'>Invited Events</Link>
        <Link to={`/user/${mongoUser._id}`}>Profile</Link>
        <button onClick={signOut}>Sign Out</button>
      </header>
  );}
  else {
    return (
      <header className='header'>
        <Link to='/' className='text-3xl transition duration-300 transform hover:scale-110'>CoordiNote</Link>
        <Link to='/login'>Login</Link>
      </header>
    )
  }
};

export default Header;