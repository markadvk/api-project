import { Response } from 'express';
import { z } from 'zod';
import { AuthedRequest } from '../middleware/authMiddleware';
import * as svc from '../services/tableService';

const createSchema = z.object({
  name: z.string().min(2),
  age: z.number().int().nonnegative(),
  role: z.string().min(2)
});

const updateSchema = createSchema.partial();

export async function getAll(_req: AuthedRequest, res: Response) {
  const list = await svc.listItems();
  res.json(list);
}

export async function postCreate(req: AuthedRequest, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const item = await svc.createItem(req.user!.id, parsed.data);
  res.status(201).json(item);
}

export async function putUpdate(req: AuthedRequest, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const item = await svc.updateItem(id, parsed.data);
  res.json(item);
}

export async function delRemove(req: AuthedRequest, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  await svc.deleteItem(id);
  res.status(204).send();
}
