import express from 'express';
import cors from 'cors';
import http from 'http';
import router from './modules/router';
import { initSocket } from './socket';
import { errorHandler } from './middleware/error.middleware';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);

// Cấu hình CORS
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true  
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

initSocket(server);

app.use(router)
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});

app.get('/',async(_req, res:any)=>{
  try {
    const users = await prisma.account.findMany();
    res.json({ message: 'Prisma connected successfully!', users });
  } catch (error) {
    res.status(500).json({ message: 'Error connecting to database', error });
  }
})

server.listen(8989, () => {
  
  console.log('Listening on http://localhost:8989');
});
