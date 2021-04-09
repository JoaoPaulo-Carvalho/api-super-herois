const request = require('supertest')
const app = require('../app')

describe('Tests / route', () => {
  test(
    'GET request -> response status 200',
    async () => await request(app)
      .get('/')
      .expect(200)
  )
})

describe('Tests /api/superheroes/search route', () => {
  test(
    'GET request [case-sensitive not set](q = ab) -> response status 400 (q.length < 3)',
    async () => await request(app)
      .get('/api/superheroes/search?q=ab')
      .expect(400)
  )

  test(
    'GET request [case-sensitive not set](q = bomb) -> response status 200',
    async () => await request(app)
      .get('/api/superheroes/search?q=bomb')
      .expect(200)
  )

  test(
    'GET request [case-sensitive = 123](q = bomb) -> response status 200',
    async () => await request(app)
      .get('/api/superheroes/search?q=bomb')
      .set('case-sensitive', '123')
      .expect(200)
  )

  test(
    'GET request [case-sensitive = true](q = bomb) -> response status 204',
    async () => await request(app)
      .get('/api/superheroes/search?q=bomb')
      .set('case-sensitive', 'true')
      .expect(204)
  )

  test(
    'GET request [case-sensitive = true](q = Bomb) -> response status 200',
    async () => await request(app)
      .get('/api/superheroes/search?q=Bomb')
      .set('case-sensitive', 'true')
      .expect(200)
  )
})

describe('Tests /api/superheroes/hero/:slug route', () => {
  test(
    'GET request (slug = a) -> response status 404',
    async () => await request(app)
      .get('/api/superheroes/hero/a')
      .expect(404)
  )

  test(
    'GET request (slug = 1-a-bomb) -> response status 200',
    async () => await request(app)
      .get('/api/superheroes/hero/1-a-bomb')
      .expect(200)
  )
})
