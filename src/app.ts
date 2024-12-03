import express , {Request, Response, NextFunction} from 'express'
import cors from 'cors'
import router from './modules/router'
import bodyParser from 'body-parser'
import { errorHandler } from './middleware/error.middleware'

const app = express()

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
)

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(router)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next)
})

export default app
