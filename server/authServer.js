require('dotenv').config()

const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const app = express();
const bcrypt = require('bcrypt')

// Import the necessary libraries and dependencies
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Girish@123",
  database: "datingapp"
});

let refreshTokens = []

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

app.delete('/adminlogout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

app.post('/adminlogin', (req, res) => {
  // Authenticate User

  const username = req.body.username
  const user = { name: username }

  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)
  res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

// Signup API endpoint
app.post('/signup', (req, res) => {
  const { name, email, password, googleIdToken } = req.body;

  if (googleIdToken) {
    // Verify the Google ID token
    async function verify() {
      try {
        const ticket = await client.verifyIdToken({
          idToken: googleIdToken,
          audience: 1028035830029-qadh282ko4pco1r4sh9tb9b59veejlu4.apps.googleusercontent.com, 
        });
        const payload = ticket.getPayload();
        const googleEmail = payload.email;

        // Check if the email from the Google ID token matches the provided email
        if (email !== googleEmail) {
          return res.status(400).json({ message: 'Email does not match with Google ID token.' });
        }

        // Perform any additional logic or checks if required

        // Save the user's information to the database (example code, you might use your database library)
        db.query("INSERT INTO users (`name`, `email`, `password`) VALUES (?, ?, ?)", [name, email, password], (err, data) => {
          if (err) {
            return res.status(500).json({ message: 'Error while saving user to database.' });
          }
          return res.status(201).json({ message: 'User signed up successfully.' });
        });
        
        // Return success response
        return res.status(201).json({ message: 'User signed up successfully.' });
      } catch (error) {
        return res.status(400).json({ message: 'Invalid Google ID token.' });
      }
    }

    verify().catch((err) => {
      return res.status(500).json({ message: 'Error while verifying Google ID token.' });
    });
  } else {
    // Handle regular sign-up without Google
    // Check if the email already exists in the database
    const checkEmailQuery = 'SELECT * FROM users WHERE `email` = ?';
    db.query(checkEmailQuery, [email], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (result.length > 0) {
        return res.status(409).json({ error: 'Email already exists' });
      }
  
      // If the email does not exist, proceed to create a new user
      const createUserQuery = 'INSERT INTO users (`name`, `email`, `password`) VALUES (?, ?, ?)';
      db.query(createUserQuery, [name, email, password], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        res.json({ message: 'User created successfully' });
      });
    });
  }  
});

// Login Route
app.post('/login', (req, res) => {
  const sql = "SELECT * FROM users WHERE `email` = ? AND `password` = ?";
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(errors);
    } else {
      if (err) {
        return res.json(err);
      }
      if (data.length > 0) {
        const user = { name: data[0].name, email: data[0].email }; // Include the user's name in the response
        return res.json(user);
      } else {
        return res.json(err);
      }
    }
  })
});

app.listen(8082, () => {
  console.log("Listening on port 8082");
});