const express = require("express")
const cors = require('cors')

// Import Routes
const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetRoutes')

const app = express()

// Conection
const conn = require('./db/conn').run

// Config JSON response
app.use(express.json())

// Cors
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))


// Public folder for images
app.use(express.static('public'))

// Routes
app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)

app.listen(3333)