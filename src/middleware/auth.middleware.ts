import { Request, Response, NextFunction } from 'express';
import  jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/response.util';

declare global {
  namespace Express {
    interface Request {
      user: any;  // Or define a more specific type for your user
    }
  }
}
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return ApiResponse.badRequest(res, 'No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    
    next();
  } catch (error) {
    return ApiResponse.error(res, error, 'Invalid token');
  }
};