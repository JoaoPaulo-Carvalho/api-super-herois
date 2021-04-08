const request = require('supertest')
const app = require('../app')

describe('Tests / route', () => {
  test(
    'GET request -> response status 200',
    () => request(app)
      .get('/')
      .expect(200)
  )
})

