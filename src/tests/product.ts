export const productTest = (request: any, app: any, token: string) => {
  describe('App test api product ', () => {
    it('GET /product should be success', async () => {
      const response = await request(app).get('/products').set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(200)
    })

    it('GET /product should be failed or dont created', async () => {
      const response = await request(app).get('/products').set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })
  })
}
