import { Request, Response } from 'express';
import { z } from 'zod';
import * as auth from '../services/authService';

const credsSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

export async function postRegister(req: Request, res: Response) {
  const parsed = credsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;
  const out = await auth.register(email, password);
  res.status(201).json(out);
}

export async function postLogin(req: Request, res: Response) {
  const parsed = credsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid credentials' });
  const { email, password } = parsed.data;
  const out = await auth.login(email, password);
  res.json(out);
}