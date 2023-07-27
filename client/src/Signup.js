import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './SignupValidation';
import axios from 'axios';
import './style.css';

function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const err = Validation(values);
    setErrors(err);

    if (err.name === '' && err.email === '' && err.password === '') {
      axios
        .post('http://localhost:8081/signup', values) // Added http:// in front of localhost
        .then((res) => {
          navigate('/');
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <div className='signup-container p-5 rounded shadow-lg'>
        <h2 className='text-center'>Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              placeholder='Enter Your Name'
              name='name'
              onChange={handleInput}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            />
            {errors.name && <div className='invalid-feedback'>{errors.name}</div>}
          </div>
          <div className='mb-3'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              placeholder='Enter Your Email'
              name='email'
              onChange={handleInput}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            />
            {errors.email && <div className='invalid-feedback'>{errors.email}</div>}
          </div>
          <div className='mb-3'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              placeholder='Enter Your Password'
              name='password'
              onChange={handleInput}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            />
            {errors.password && <div className='invalid-feedback'>{errors.password}</div>}
          </div>
          <button type='submit' className='btn btn-primary w-100'>
            Sign up
          </button>
          <p className='mt-3 mb-0 text-center'>
            Already have an account? <Link to='/login'>Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
