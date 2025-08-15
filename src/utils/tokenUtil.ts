import jwt from 'jsonwebtoken';

type Payload = { id: number; email: string; role: string };

export function signToken(payload: Payload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

export function verifyToken(token: string): Payload {
  return jwt.verify(token, process.env.JWT_SECRET!) as Payload;
}