import express from 'express';
import cors from 'cors';
import http from 'http';
import router from './modules/router';
import { initSocket } from './socket';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const server = http.createServer(app);
 
// Cấu hình CORS
app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST"],
  credentials: true  
}));

initSocket(server);

app.use(router)
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});

server.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
