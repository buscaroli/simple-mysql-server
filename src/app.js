const express = require('express')
const res = require('express/lib/response')
const mysql = require('mysql')
const PORT = process.env.PORT || 3000

const app = express()
const pool = mysql.createPool({
  host: '127.0.0.1',
  port: '3306',
  user: 'newuser',
  password: 'newpassword',
  database: 'myDatabase',
})

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/showAll', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err

    console.log(`Connected as ID ${connection.threadId}`)
    connection.query('SELECT * FROM Students', (err, records) => {
      connection.release()
      if (err) throw err

      console.log('Data from Database:\n', records)
    })
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
