const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const app = express();
const port = 8080;

app.use(bodyParser.json());

let db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to database');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      hashed_password TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      county TEXT NOT NULL,
      subcounty TEXT NOT NULL,
      meter_number TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table', err);
    } else {
      console.log('Table created successfully');
    }
  });
});


function generateMeterNumber(county, subCounty) {
  const countyPrefix = county.substring(0, 2).toUpperCase();
  const subCountyPrefix = subCounty.substring(0, 2).toUpperCase();
  const randomNumber = crypto.randomInt(100000, 1000000);
  const meterNumber = `${countyPrefix}${subCountyPrefix}${randomNumber}`;
  return meterNumber;
}

app.post('/addUser', (req, res) => {
    const { name, email, password, phoneNumber, county, subCounty } = req.body;
    console.log('Received data:', req.body); 
    const meterNumber = generateMeterNumber(county, subCounty);
  
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password', err); 
        return res.status(500).json({ error: 'Error hashing password' });
      }
  
      db.run(`
        INSERT INTO users (name, email, hashed_password, phone_number, county, subcounty, meter_number)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [name, email, hashedPassword, phoneNumber, county, subCounty, meterNumber], (err) => {
        if (err) {
          console.error('Error inserting user:', err.message); // Log detailed error message
          return res.status(500).json({ error: 'Error inserting user' });
        } else {
          return res.status(200).json({ message: 'User added successfully', meterNumber });
        }
      });
      
    });
  });
  

app.get('/users', (req, res) => {
  db.all('SELECT id, name, email, phone_number, county, subcounty, meter_number FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving users' });
    } else {
      return res.status(200).json(rows);
    }
  });
});

app.get('/user/:id', (req, res) => {
  const userId = req.params.id;

  db.get('SELECT id, name, email, phone_number, county, subcounty, meter_number FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving user' });
    } else if (row) {
      return res.status(200).json(row);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  });
});

app.delete('/user/:id', (req, res) => {
  const userId = req.params.id;

  db.run('DELETE FROM users WHERE id = ?', [userId], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error deleting user' });
    } else if (this.changes > 0) {
      return res.status(200).json({ message: 'User deleted successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
