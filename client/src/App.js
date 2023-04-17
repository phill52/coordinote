import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/loginpage';
import NewEvent from './pages/newEvent';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
function App() {
  return (
    <Router className='router'>
    <div className="App">
      <div className='App-header'>
        <p>Hello</p>
      </div>
      <div className='App-body'>
          <Routes>
            <Route path='/newEvent' element={<NewEvent />}/>
            <Route path='/login' element={<LoginPage />} />
          </Routes>
      </div>
    </div>
    </Router>
  );
}

export default App;
