export const areaTest = (request: any, app: any, tokenAdmin: string, tokenCustomer: string) => {
  describe('App test api areas ', () => {
    let id = 'e408e23c-b21b-11ef-93da-0242ac130002'

    it('GET /areas/ should return a list of areas', async () => {
      const response = await request(app).get('/areas/').set('Authorization', `Bearer ${tokenAdmin}`)
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        data: expect.any(Array),
        message: expect.any(String)
      })
    })

    it('POST /areas/ should return a new area', async () => {
      const response = await request(app).post('/areas/').set('Authorization', `Bearer ${tokenAdmin}`).send({
        name: '123'
      })
      if (response.status === 400) {
        expect(response.status).toBe(400)
        expect(response.body).toEqual({
          success: expect.any(Boolean),
          message: expect.any(String)
        })
      } else {
        id = response.body.data.areaId
        expect(response.status).toBe(201)
        expect(response.body).toEqual({
          data: expect.any(Object),
          message: expect.any(String)
        })
      }
    })

    it('PUT /areas/ should be failed or dont created', async () => {
      const response = await request(app).put(`/areas/${id}`).set('Authorization', `Bearer ${tokenAdmin}`).send({
        name: 'Updated'
      })
      if (response.status === 404) {
        expect(response.status).toBe(404)
        console.log(response.body)
        expect(response.body).toEqual({
          success: expect.any(Boolean),
          message: expect.any(String)
        })
      } else if (response.status === 400) {
        console.log(response.body)
        expect(response.status).toBe(400)
        expect(response.body).toEqual({
          success: expect.any(Boolean),
          message: expect.any(String)
        })
      } else {
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
          data: expect.any(Object),
          message: expect.any(String)
        })
      }
    })

    it("DELETE /areas/ should be failed or don't created", async () => {
      const response = await request(app).delete(`/areas/${id}`).set('Authorization', `Bearer ${tokenAdmin}`)
      if (response.status === 404) {
        expect(response.status).toBe(404)
        // console.log('404', response.body)
        expect(response.body).toEqual({
          success: expect.any(Boolean),
          message: expect.any(String)
        })
      } else if (response.status === 400) {
        // console.log('400', response.body)
        expect(response.status).toBe(400)
        expect(response.body).toEqual({
          success: expect.any(Boolean),
          message: expect.any(String)
        })
      } else {
        expect(response.status).toBe(200)
        // console.log('200', response.body)
        expect(response.body).toEqual({
          data: expect.any(Boolean),
          message: expect.any(String)
        })
      }
    })
  })
}