const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');
const socketService = require('./src/services/socketService');

dotenv.config();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// setup socket.io and attach to app
const io = socketService.setup(server);
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
const pool = require('./src/config/database');

async function shutdown(signal) {
  console.log(`Received ${signal}. Shutting down...`);
  try {
    server.close(() => console.log('HTTP server closed'));
    if (io && typeof io.close === 'function') io.close();
    await pool.end();
    console.log('DB pool closed');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown', err);
    process.exit(1);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
