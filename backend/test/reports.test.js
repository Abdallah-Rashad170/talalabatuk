const request = require('supertest');
const app = require('../app');

describe('Reports API', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ phone: '01015819017', password: 'Admin@123' })
      .expect(200);
    token = res.body.token;
  });

  test('GET /api/reports/export/excel returns file stream', async () => {
    const res = await request(app)
      .get('/api/reports/export/excel')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // should be CSV or excel MIME
    expect(res.headers['content-type']).toMatch(/(text\/csv|vnd.openxmlformats-officedocument.spreadsheetml.sheet|octet-stream)/i);
  });
});
