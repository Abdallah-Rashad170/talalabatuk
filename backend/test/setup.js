const pool = require('../src/config/database');

afterAll(async () => {
  try {
    await pool.end();
    // give Node a moment to release handles
    await new Promise((r) => setTimeout(r, 50));
  } catch (err) {
    // ignore errors during shutdown
  }
});
