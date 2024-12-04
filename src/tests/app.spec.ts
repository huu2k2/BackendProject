import request from 'supertest'
import app from '../app'
import { loginTest } from './login'
import { productTest } from './product'
import { categoryTest } from './category'
import { areaTest } from './area'
import { tableTest } from './table'

const tokenManager =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiJkZTAxNWFkNC1hYzcxLTExZWYtYjdiYS0wMjQyYWMxMjAwMDIiLCJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiIkMmEkMTIkUzAxS3J0OWcvWndRUFY1Y1B3U1ltT2F5aVNMVzBLQUtiTHRYa3J2cGhZS0pmODVGY1p2R3UiLCJyb2xlSWQiOiJiMzRmMmIyMi1hYzcxLTExZWYtYjdiYS0wMjQyYWMxMjAwMDIiLCJpc0FjdGl2ZSI6dHJ1ZSwiY3JlYXRlZEF0IjoiMjAyNC0xMS0yN1QwMzo0NDoxMi43NjhaIiwicm9sZSI6eyJuYW1lIjoiQURNSU4ifSwicHJvZmlsZSI6eyJwcm9maWxlSWQiOiI3ZGU5MWI1ZC1iMDY4LTExZWYtYmQzOS0wMjQyYWMxMzAwMDIiLCJmaXJzdE5hbWUiOiJiIiwibGFzdE5hbWUiOiJiIiwiYWRkcmVzcyI6ImIiLCJwaG9uZU51bWJlciI6ImIiLCJjY2NkIjoiYiIsImFjY291bnRJZCI6ImRlMDE1YWQ0LWFjNzEtMTFlZi1iN2JhLTAyNDJhYzEyMDAwMiIsImNyZWF0ZWRBdCI6IjIwMjQtMTItMDJUMDQ6NDc6MTAuNzI4WiJ9LCJpYXQiOjE3MzMyOTk1MzYsImV4cCI6MTczMzMxNzUzNn0.eI0vslUT1fgu4sd0prUfSrACJHV9kb1SyfZ0GJqPUxY'
const tokenCheff = 'cvbnm,'
const tokenStaff = 'dfghjkl'
const tokenCustomer =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lcklkIjoiNWJlMWNmNTAtYWM3My0xMWVmLWI3YmEtMDI0MmFjMTIwMDAyIiwiY3JlYXRlZEF0IjoiMjAyNC0xMS0yN1QwMzo1NDo1My40NTBaIiwicGhvbmVOdW1iZXIiOiIxMiIsIm5hbWUiOiJ0Iiwicm9sZSI6eyJuYW1lIjoiQ1VTVE9NRVIifSwiaWF0IjoxNzMzMjk5NDczLCJleHAiOjE3MzMzMTc0NzN9.UUcS-az-AzJothFQHkKW57E6FS9PQ9GYz1udG4RNn08'

// describe('App Test Suite', () => {
//   it('GET /health should return 200', async () => {
//     const response = await request(app).get('/health')
//     expect(response.status).toBe(200)
//     expect(response.body).toEqual({ status: 'OK' })
//   })
// })
// loginTest(request, app)
// categoryTest(request, app, tokenManager, tokenCustomer)
// areaTest(request, app, tokenManager, tokenCustomer)
tableTest(request, app, tokenManager, tokenCheff, tokenStaff)
// productTest(request, app)
