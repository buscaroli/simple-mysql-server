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
    if (err) res.status(500).send(err)

    let sql = 'SELECT * FROM Students'
    console.log(`Connected as ID ${connection.threadId}`)
    let query = connection.query(sql, (err, records) => {
      connection.release()
      if (err) throw err

      console.log('Data from Database:\n', records)
      res.send(records)
    })
  })
})

app.post('/insertOne', (req, res) => {
  pool.getConnection((err, connection) => {
    console.log('========== insertOne ===========')
    if (err) res.status(500).send(err)

    console.log(req.query)
    let { firstName, lastName, email } = req.query

    console.log(firstName)
    let sql = `INSERT INTO Students (firstName, lastName, email) VALUES ('${firstName}', '${lastName}', '${email}');`

    let query = connection.query(sql, (err, record) => {
      if (err) res.status(400).send(err)

      console.log(`Record added:\n${query.sql}`)
      res.status(201).send()
    })
  })
})

app.post('/findByID', (req, res) => {
  pool.getConnection((err, connection) => {
    console.log('=========== findByID ===========')
    if (err) res.status(500).send(err)

    let sql = `SELECT * FROM Students WHERE studentID = '${req.query.studentID}';`
    console.log(req.query.studentID)

    let query = connection.query(sql, (err, record) => {
      if (err) {
        res.status(400).send(err)
      } else if (record[0] === undefined || record === []) {
        res.status(404).send(err)
      } else {
        console.log('Record Found:\n', query.sql)
        res.send(record[0])
      }
    })
  })
})

// TODO FIX ERROR HANDLING
app.delete('/deleteOne', (req, res) => {
  pool.getConnection((err, connection) => {
    console.log('========== deleteOne ===========')
    if (err) res.status(500).send(err)

    let sql = `DELETE FROM Students WHERE studentID = '${req.query.studentID}';`
    console.log(req.query.studentID)

    let query = connection.query(sql, (err, record) => {
      res.send()
    })
  })
})

// TODO FIX ERROR HANDLING
app.put('/updateOne', (req, res) => {
  pool.getConnection((err, connection) => {
    console.log('========== updateOne ===========')
    if (err) res.status(500).send(err)

    let { firstName, lastName, email } = req.query

    let sql = `UPDATE Students SET firstName = '${firstName}', lastName = '${lastName}', email = '${email}' WHERE studentID = '${req.query.studentID}';`

    let query = connection.query(sql, (err, record) => {
      res.send()
    })
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
