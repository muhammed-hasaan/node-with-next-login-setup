const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const userRoute = require('./Routes/user')
const blogRoute = require('./Routes/blog')
app.use(morgan('tiny'))
app.use(express.json())

mongoose.connect('mongodb+srv://blog:blog@cluster0.hw5owlh.mongodb.net/').then(() =>
    console.log('Mongodb Connected'))
    .catch((err) => console.log(err))

app.get('/', (req, res) => {
    res.send(new Date())
})

app.use('/user', userRoute)
app.use('/blog', blogRoute)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('App is running on port ' + PORT)
})