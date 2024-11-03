import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  role?: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    { expiresIn: '90d' } // Token hết hạn sau 90d
  );
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};