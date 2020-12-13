const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const passportHTTP = require('passport-http');
const app = express();
const port = 4000;
const db = require('./db');


app.use(cors());
app.use(bodyParser.json());

app.get('/fetchItems', (req, res) => {
  db.query('SELECT * FROM items').then(results => {
    res.json({ items: results })
  });
})

app.get('/fetchFeatured', (req, res) => {
    db.query('SELECT * FROM items ORDER BY timesbought DESC LIMIT 5').then(results => {
      res.json({ items: results })
    });
  })

app.post('/fetchItemInfo', (req, res) =>{
    db.query('SELECT * FROM items WHERE productURL = ?', [req.body.productURL]).then(results => {
      res.json({ item: results })
    });
  })

app.post('/addNewItem', (req, res) =>{
  console.log(req.body)
  db.query('SELECT COUNT(*) AS name FROM items WHERE name = ?', [req.body.name]).then(dbResults => {
    if(dbResults[0].name >= 1){
      console.log(dbResults)
      res.send("Product name taken")
    }else{
      console.log(dbResults[0].name)
      res.sendStatus(200)
      db.query('INSERT INTO items (name, productURL, price, description, tags, imgURL, timesbought) VALUES (?,?,?,?,?,?,?)',
                [req.body.name, req.body.productURL, req.body.price, req.body.description, req.body.tags, req.body.imgURL, req.body.timesbought]);
    }
  }
).catch(err => res.send(err))
}
)

/* DB init */
Promise.all(
    [
        db.query(`CREATE TABLE IF NOT EXISTS items(
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            productURL VARCHAR(100),
            description VARCHAR(2000),
            imgURL VARCHAR(2000),
            price DOUBLE,
            tags VARCHAR(240),
            timesbought INT
        )`),
        db.query(`CREATE TABLE IF NOT EXISTS users(
            id VARCHAR(255) PRIMARY KEY,
            username VARCHAR(255),
            password VARCHAR(255),
            UNIQUE (username)
        )`)
  
        // Add more table create statements if you need more tables
    ]
  ).then(() => {
    console.log('databases initialized');
    app.listen(port, () => {
        console.log(`Server API listening on http://localhost:${port}\n`);
    });
  })
  .catch(error => console.log(error));