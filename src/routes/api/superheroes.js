const express = require('express')
const fs = require('fs/promises')
const path = require('path')
const axios = require('axios')
const _ = require('lodash')

const router = express.Router()

const superheroesDataPath = path.join(__dirname, '..', '..', 'data', 'superheroes', 'all.json')
const { superheroesAPIUrl } = require('../../config/api')

const objectIncludes = (obj, str, caseSensitive) => {
  if (typeof obj === 'object' && obj) {
    return Object.values(obj).find(v => {
      if (typeof v === 'object') {
        if (objectIncludes(v, str, caseSensitive)) return true
      } else if (v) {
        if (caseSensitive) {
          if (v.toString().includes(str)) return true
        } else {
          if (v.toString().toLowerCase().includes(str.toLowerCase())) return true
        }
      }
    })
  } else if (obj) {
    if (caseSensitive) {
      if (v.toString().includes(str)) return true
    } else {
      if (v.toString().toLowerCase().includes(str.toLowerCase())) return true
    }
  }

  return false
}

const pullAndGetSuperheroes = () => {
  console.log('File not found. Making API request')
  return axios({
    method: 'GET',
    url: superheroesAPIUrl
  })
    .then(res => {
      const data = res.data

      fs.writeFile(superheroesDataPath, JSON.stringify(data))
        .catch(() => {
          console.log('Unable to save file.')
        })

      console.log('Returning data from API')
      return data
    })
    .catch(() => {
      console.log('Unable to get data from API.')
      return []
    })
}

const getSuperheroes = () =>
  fs.readFile(superheroesDataPath, 'utf8')
    .then(data => JSON.parse(data))
    .catch(() => pullAndGetSuperheroes())

router.get('/search', (req, res) => {
  const caseSensitive = req.headers['case-sensitive'] === 'true'
  const query = req.query.q || ''

  if (query.length < 3) {
    return res.status(400).json({ error: 'Search query with less than 3 characters!' })
  }

  getSuperheroes()
    .then(superheroes => superheroes.filter(sh => {
      if (caseSensitive) {
        if (sh.name.includes(query)) return true
      } else {
        if (sh.name.toLowerCase().includes(query.toLowerCase())) return true
      }

      if (objectIncludes(sh.appearance, query, caseSensitive)) return true
      if (objectIncludes(sh.biography, query, caseSensitive)) return true
      if (objectIncludes(sh.work, query, caseSensitive)) return true

      return false
    }))
    .then(superheroes => res.status(superheroes.length ? 200 : 204).json(superheroes))
})

router.get('/hero/:slug', (req, res) => {
  const slug = req.params.slug

  getSuperheroes()
    .then(superheroes => superheroes.filter(sh => sh.slug === slug)[0])
    .then(superhero => {
      if (superhero) {
        return res.status(200).json(superhero)
      } else {
        return res.status(404).json({ error: 'Hero not found!' })
      }
    })
})

module.exports = router
