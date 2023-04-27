import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/loginpage';
import NewEvent from './pages/newEvent';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import fire from './fire';
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  fire.auth().onAuthStateChanged((user) => {
    return user ? setLoggedIn(true) : setLoggedIn(false);
  });

  return (
    <Router className='router'>
    <div className="App">
      {!loggedIn ?<>
          <header className='App-header'>
            <p>Hello</p>
            <Link to='/newEvent'>New Event</Link>
            <Link to='/'>Home</Link>
            <Link to='/login'>Login</Link>
          </header>
          <div className='App-body'>
            <Routes>
              <Route path='/newEvent' element={<LoginPage />}/>
              <Route path='/login' element={<LoginPage />} />
            </Routes>
          </div>
      </> : 
      <>
        <header className='App-header'>
          <p>Hello</p>
          <Link to='/newEvent'>New Event</Link>
          <Link to='/'>Home</Link>
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
