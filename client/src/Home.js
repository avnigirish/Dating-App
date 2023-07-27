import React from 'react';
import './style.css';

const Home = ({ user }) => {
  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <div className='home-container bg-white p-5 rounded shadow-lg'>
        <h2 className='text-center'>Welcome, {user && user.name}!</h2>
        {/* Add your homepage content here */}
        <p className='mt-3 mb-0 text-center'>This is your homepage content.</p>
      </div>
    </div>
  );
};

export default Home;