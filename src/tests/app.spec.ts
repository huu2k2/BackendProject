import request from 'supertest';
import app from '../app';
import { loginStaff } from './login.spec';

describe('App Test Suite', () => {
  it('GET /health should return 200', async () => {
    const response = await request(app).get('/health'); 
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });
  loginStaff(request, app)
});
