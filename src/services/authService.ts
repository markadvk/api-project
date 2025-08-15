import prisma from '../config/db';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/tokenUtil';

export async function register(email: string, password: string) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw { status: 409, message: 'User already exists' };
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash } });
  return { id: user.id, email: user.email };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 401, message: 'Invalid email or password' };
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw { status: 401, message: 'Invalid email or password' };
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { token };
}