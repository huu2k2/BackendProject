import http from 'http';
import app from './app';
import { initSocket } from './socket';

const server = http.createServer(app);

// Khởi tạo Socket.IO
initSocket(server);

// Lắng nghe cổng 8989
server.listen(8989, () => {
  console.log('Listening on http://localhost:8989');
});
