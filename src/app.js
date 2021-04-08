const express = require('express')
const app = express()

const { PORT } = require('./config/server')

app.get('/', (req, res) => res.status(200).send('Super heroes API is working!'))

module.exports = app

app.listen(PORT, () => console.log(`Super heroes API listening on port ${PORT}`))
