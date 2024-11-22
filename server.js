const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');  

const app = express();
const port = 5000;


app.use(cors()); 

app.use(bodyParser.json());

app.post('/register', (req, res) => {
  const userData = req.body;
  
  
  const usersFilePath = path.join(__dirname, 'users.json');
  console.log(userData);
  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    if (err && err.code === 'ENOENT') {
      
      const users = [];
      users.push(userData);

      fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to save user data' });
        }
        return res.status(200).json({ message: 'User registered successfully' });
      });
    } else if (err) {
      return res.status(500).json({ message: 'Failed to read users file' });
    } else {

      const users = JSON.parse(data);
      users.push(userData);

      fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to save user data' });
        }
        return res.status(200).json({ message: 'User registered successfully' });
      });
    }
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const usersFilePath = path.join(__dirname, 'users.json');

  fs.readFile(usersFilePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading users data' });
    }
    const users = JSON.parse(data);
    const user = users.find((user) => user.email === email);
    if (user && user.password === password) {
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
  });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
