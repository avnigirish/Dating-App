const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const { check, validationResult } = require('express-validator');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Girish@123",
  database: "datingapp"
});

// Signup API endpoint
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
  
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
        return res.json("Success");
      } else {
        return res.json("Fail");
      }
    }
  });
});

app.listen(8081, () => {
  console.log("Listening on port 8081");
});