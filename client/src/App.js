import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home'; // Import the Home component
import './style.css';

function App() {
  const [user, setUser] = useState(null); // Assuming you have user info after successful login

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login setUser={setUser} />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<Home user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
