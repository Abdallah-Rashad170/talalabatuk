const request = require('supertest');
const app = require('../app');

describe('Dashboard API', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ phone: '01015819017', password: 'Admin@123' })
      .expect(200);
    token = res.body.token;
  });

  test('overview returns totals and orders for admin', async () => {
    const res = await request(app)
      .get('/api/dashboard/overview')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('totals');
  });
});
