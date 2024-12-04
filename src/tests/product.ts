import { CreateProductDto } from "../modules/product/dto"

export const productTest = (request: any, app: any, token: string) => {
  describe('App test api product ', () => {
    it('GET /product should be success', async () => {
      const response = await request(app).get('/products').set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(200)
    })

    it('GET /product should be failed or dont created', async () => {
      const response = await request(app).get('/products').set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(200)

    const products: CreateProductDto[] = response.body;

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);

    products.forEach((product) => {
      expect(product).toHaveProperty('name');
      expect(typeof product.name).toBe('string');

      expect(product).toHaveProperty('description');
      expect(typeof product.description).toBe('string');

      expect(product).toHaveProperty('image');
      expect(typeof product.image).toBe('string');

      expect(product).toHaveProperty('price');
      expect(typeof product.price).toBe('number');

      if (product.categoryId) {
        expect(typeof product.categoryId).toBe('string');
      }
      if (product.isActive !== undefined) {
        expect(typeof product.isActive).toBe('boolean');
      }
    })
    })
  })
}
