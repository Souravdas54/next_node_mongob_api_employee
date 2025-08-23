require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')

const cors = require('cors') // Connect NODE.JS + NEXT.JS

const DbConnection = require('./app/config/dbCon')
DbConnection()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/server/uploads', express.static(path.join(__dirname, './uploads')))

app.use(cors())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // credentials: true
}));

const userRouter = require('./app/router/employeeRouter')

app.use('/api', userRouter)

const PORT = 8500
app.listen(PORT, () => {
  console.log(`Server at running http://localhost:${PORT}`);

})