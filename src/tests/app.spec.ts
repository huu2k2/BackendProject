import request from 'supertest'
import app from '../app'
import { loginTest } from './login'
import { productTest } from './product'

const tokenManager = 'asdfv' // create token for all test case , set authorization Bearer + 'token'
const tokenCheff = 'cvbnm,'
const tokenStaff = 'dfghjkl'

describe('App Test Suite', () => {
  it('GET /health should return 200', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'OK' })
  })
})
loginTest(request, app)
productTest(request, app, tokenManager)
