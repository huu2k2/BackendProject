export const loginTest = (request: any, app: any) => {
  describe('App test api login ', () => {
    it('POST /login/staff should be success', async () => {
      const response = await request(app).post('/login/staff').send({ username: 'a', password: '1' })

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('Staff logged in successfully')

      expect(response.body.data).toHaveProperty('token')
      expect(typeof response.body.data.token).toBe('string')

      expect(response.body.data).toHaveProperty('refreshToken')
      expect(typeof response.body.data.refreshToken).toBe('string')
    })

    it('POST /login/staff should be wrong password', async () => {
      const response = await request(app).post('/login/staff').send({ username: 'admin', password: '123' })
      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        message: 'Invalid password',
        success: false
      })
    })

    it('POST /login/staff should be wrong isActive', async () => {
      const response = await request(app).post('/login/staff').send({ username: 'admin', password: '123' })
      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Staff is block!',
        success: false
      })
    })
  })
}
