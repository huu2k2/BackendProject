export const tableTest = (request: any, app: any, tokenAdmin: string, tokenCheff: string, tokenStaff: string) => {
  describe('App test api tables ', () => {
    let id = 'a47913a2-b224-11ef-b61c-0242ac120002'

    it('GET /tables/ should return a list of tables', async () => {
      const response = await request(app).get('/tables/').set('Authorization', `Bearer ${tokenAdmin}`)
      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        data: expect.any(Array),
        message: expect.any(String)
      })
    })

    it('POST /tables/ should return a new table', async () => {
      const response = await request(app).post('/tables/').set('Authorization', `Bearer ${tokenAdmin}`).send({
        name: '0033',
        areaId: 'dae6514b-ac72-11ef-b7ba-0242ac120002'
      })
      if (response.status === 400) {
        expect(response.status).toBe(400)
        expect(response.body).toEqual({
          success: expect.any(Boolean),
          message: expect.any(String)
        })
      } else {
        id = response.body.data.tableId
        expect(response.status).toBe(201)
        expect(response.body).toEqual({
          data: expect.any(Object),
          message: expect.any(String)
        })
      }
    })

    it('GET /tables/id should return a new table', async () => {
      const response = await request(app).get(`/tables/${id}`).set('Authorization', `Bearer ${tokenAdmin}`)
      if (response.status === 400) {
        expect(response.status).toBe(400)
        expect(response.body).toEqual({
          success: expect.any(Boolean),
          message: expect.any(String)
        })
      } else {
        id = response.body.data.tableId
        expect(response.status).toBe(201)
        expect(response.body).toEqual({
          data: expect.any(Object),
          message: expect.any(String)
        })
      }
    })

    it('PUT /tables/ should be failed or dont created', async () => {
      const response = await request(app).put(`/tables/${id}`).set('Authorization', `Bearer ${tokenAdmin}`).send({
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
          message: expect.any(String),
          data: expect.any(Boolean)
        })
      }
    })

    it("DELETE /tables/ should be failed or don't created", async () => {
      const response = await request(app).delete(`/tables/${id}`).set('Authorization', `Bearer ${tokenAdmin}`)
      if (response.status === 404) {
        expect(response.status).toBe(404)
        expect(response.body).toEqual({
          success: expect.any(Boolean),
          message: expect.any(String)
        })
      } else if (response.status === 400) {
        expect(response.status).toBe(400)
        expect(response.body).toEqual({
          success: expect.any(Boolean),
          message: expect.any(String)
        })
      } else {
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
          data: expect.any(Boolean),
          message: expect.any(String)
        })
      }
    })
  })
}
