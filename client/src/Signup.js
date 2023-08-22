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

    // Function to handle Google Sign-In
  const handleGoogleSignUp = () => {
    // Load Google Sign-In API script
    
    if (window.gapi) {
      window.gapi.load('auth2', () => {
        window.gapi.auth2
          .init({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          })
          .then((auth2) => {
            // Sign in with Google
            auth2.signIn().then((googleUser) => {
              const profile = googleUser.getBasicProfile();
              const email = profile.getEmail();
              const name = profile.getName();

              // Submit the Google sign-up data to your server
              axios
                .post('http://localhost:8081/signup', {
                  name: name,
                  email: email,
                  googleIdToken: googleUser.getAuthResponse().id_token,
                })
                .then((res) => {
                  // Handle the response if needed
                })
                .catch((err) => console.log(err));
            });
          })
          .catch((error) => {
            console.log('Google Sign-In Error:', error);
          });
      });
    } else{
      console.log('Google API not loaded.');
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
        </form>
        <div className='or-divider text-center mt-3'>OR</div>
        <button
          onClick={handleGoogleSignUp}
          className='btn btn-google w-100 mt-3'
        >
          Sign up with Google
        </button>
        <p className='mt-3 mb-0 text-center'>
          Already have an account? <Link to='/login'>Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
