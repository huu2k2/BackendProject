import jwt from 'jsonwebtoken'

export const generateTokenWithExpireTime = (payload: any, time: string): string => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    { expiresIn: time } // Token hết hạn sau 90d
  )
}

export const generateTokenAndRefreshToken = (payload: any): { token: string; refreshToken: string } => {
  const token = generateTokenWithExpireTime(payload, '1h')
  const refreshToken = generateTokenWithExpireTime(payload, '7d')
  return { token, refreshToken }
}

export const verifyToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return decoded
  } catch (error) {
    throw new Error('Invalid token')
  }
}
