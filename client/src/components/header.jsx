import React from 'react';
import { useState, useEffect } from 'react';
import { auth, createToken } from '../fire';
import AuthContext from '../AuthContext';
import {Link} from 'react-router-dom';

const Header = () => {
  const {mongoUser, currentUser, loadingMongo} = React.useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const signOut = () => {
    auth.signOut()
    window.location.href = '/';
  };

  if (currentUser&&loadingMongo){
    return (
      <header className='header'>
        <p>...</p>
      </header>
    )
  }
  console.log("MONGO USER2", mongoUser)
  const closeMenu = () => {
    setOpen(false);
  };

  if (currentUser) {
  return (
    <header className='header'>
        <Link to='/' className='text-3xl transition duration-300 transform hover:scale-110 font-bold'>CoordiNote</Link>
          <span class="material-symbols-outlined" className='cursor-pointer' onClick={()=>setOpen(a=>!a)}>
            menu
          </span>
          {open && (
          <div className="overlay" onClick={closeMenu}>
            <div className={`side-menu${open ? " open" : ""}`}>
              <button className="close-button" onClick={closeMenu}>
                &times;
              </button>
              <Link to="/newEvent" onClick={closeMenu}>
                New Event
              </Link>
              <Link to="/createdEvents" onClick={closeMenu}>
                My Events
              </Link>
              <Link to="/invitedEvents" onClick={closeMenu}>
                Invited Events
              </Link>
              <Link to={`/user/${mongoUser._id}`} onClick={closeMenu}>
                Profile
              </Link>
              <button onClick={signOut}>Sign Out</button>
            </div>
          </div>
        )}
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