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

// Signup Route
app.post('/signup', (req, res) => {
  const sql = "INSERT INTO users (`name`, `email`, `password`) VALUES (?)";
  const values = [
    req.body.name,
    req.body.email,
    req.body.password
  ];

  db.query(sql, [values], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
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
