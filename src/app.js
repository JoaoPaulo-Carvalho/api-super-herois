const express = require('express')
const app = express()

const { PORT } = require('./config/server')

app.get('/', (req, res) => res.status(200).send('Super heroes API is working!'))

app.use('/api/superheroes', require('./routes/api/superheroes'))

app.listen(PORT, () => console.log(`Super heroes API listening on port ${PORT}`))

module.exports = app
