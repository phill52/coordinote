import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import NewEvent from './newEvent';

function App() {
  return (
    <Router className='router'>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Link className='App-link' to='/event/newEvent'>Create a new event</Link>
      </header>
      <div className='App-body'>
          <Routes>
            <Route path='/event/newEvent' element={<NewEvent />} />
          </Routes>
      </div>
    </div>
    </Router>
  );
}

export default App;
