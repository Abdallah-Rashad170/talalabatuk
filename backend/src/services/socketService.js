let ioInstance = null;

exports.setup = (server) => {
  const { Server } = require('socket.io');
  const io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);
    socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
  });
  ioInstance = io;
  return io;
};

exports.get = () => ioInstance;
