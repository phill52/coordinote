import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/loginpage';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
function App() {
  return (
    <Router className='router'>
    <div className="App">
      <div className='App-body'>
          <Routes>
            <Route path='/login' element={<LoginPage />} />
          </Routes>
      </div>
    </div>
    </Router>
  );
}

export default App;
