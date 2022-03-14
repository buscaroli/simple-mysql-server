const express = require('express')
const res = require('express/lib/response')
const mysql = require('mysql')
const PORT = process.env.PORT || 3000

const app = express()
const db = mysql.createConnection({
  host: '127.0.0.1',
  post: '3306',
  user: 'newuser',
  password: 'newpassword',
  database: 'myDatabase',
})

db.connect((err) => {
  if (err) throw err

  console.log('Connected to the Database...')
})

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/showAll', (req, res) => {
  db.query('SELECT * from Students', (err, rows) => {
    if (err) throw err

    console.log('The data from users table are: \n', rows)
    // do not use db.end() as you shouldn't be closing the connection at every query!
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
