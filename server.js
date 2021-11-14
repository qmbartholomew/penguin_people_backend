/*          DEPENDENCIES            */
require('dotenv').config()
const {PORT = 3001, DATABASE_URL} = process.env
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

/*          DATABASE CONNECTION         */
// establish connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

// Connection Events
mongoose.connection
.on("open", () => console.log("You are connected to Mongo"))
.on("close", () => console.log("You are disconnected from Mongo"))
.on("error", (error) => console.log(error))

/*          MODELS          */
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
}, {timestamps: true})

const People = mongoose.model('People', PeopleSchema)

/*          MIDDLEWARE          */
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

/*          ROUTES          */
app.get('/', (req, res) => {
    res.send('Hello World')
})

// People index route
app.get('/people', async (req, res) => {
    try {
        res.json(await People.find({}))
    } catch(error) {
        res.status(400).json({error})
    }
})

// People create route
app.post('/people', async (req, res) => {
    try {
        // Create new person
        res.json(await People.create(req.body))
    } catch(error) {
        res.status(400).json({error})
    }
})

// People update route
app.put('/people/:id', async (req, res) => {
    try {
        const id = req.params.id
        // Create new person
        res.json(await People.findByIdAndUpdate(id, req.body, {new: true}))
    } catch(error) {
        res.status(400).json({error})
    }
})

// People desroy route
app.delete('/people/:id', async (req, res) => {
    try {
        const id = req.params.id
        // Create new person
        res.json(await People.findByIdAndRemove(id))
    } catch(error) {
        res.status(400).json({error})
    }
})

/*          SERVER LISTENER         */
app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)})