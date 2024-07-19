const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const saltRounds = 10;


app.use(bodyParser.json());

// Dummy user database
const users = [];

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = { email, password: hashedPassword };
    
    users.push(newUser); // Save to actual database

    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = users.find(user => user.email === email); // Retrieve from your actual database

    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (error) {
    res.status(500).send('Error logging in user');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
