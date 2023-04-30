import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/loginpage';
import NewEvent from './pages/newEvent';
import ResponseToInvite from './pages/responseToInvite';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
function App() {
  return (
    <Router className='router'>
    <div className="App">
      <header className='App-header'>
        <p>Hello</p>
        <Link to='/newEvent'>New Event</Link>
        <Link to='/'>Home</Link>
        <Link to='/login'>Login</Link>
        <Link to='/event/644de169c0db45afd6c99705'>event</Link>
      </header>
      <div className='App-body'>
          <Routes>
            <Route path='/newEvent' element={<NewEvent />}/>
            <Route path='/login' element={<LoginPage />} />
            <Route path = '/event/:id' element={<ResponseToInvite />} />
          </Routes>
      </div>
    </div>
    </Router>
  );
}

export default App;
