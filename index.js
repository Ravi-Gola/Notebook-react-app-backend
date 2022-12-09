const connectToMongo = require('./db');
const express = require('express');
const { Router } = require('express');
var cors = require('cors')

connectToMongo();
const app = express()
const port = 5000



//middleware for use req.body
app.use(cors())
app.use(express.json())

//Available Routes

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`inotebook-backend listening on http://localhost:${port}/`)
})
