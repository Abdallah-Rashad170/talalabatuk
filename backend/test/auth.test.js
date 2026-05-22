const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  test('admin can login and receive token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ phone: '01015819017', password: 'Admin@123' })
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('token');
  });
});
