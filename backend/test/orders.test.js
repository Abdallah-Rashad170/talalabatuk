const request = require('supertest');
const app = require('../app');

describe('Orders API', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ phone: '01015819017', password: 'Admin@123' })
      .expect(200);
    token = res.body.token;
  });

  test('GET /api/orders returns list (protected)', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data || res.body.orders || [])).toBe(true);
  });
});
