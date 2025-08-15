import prisma from '../config/db';

export async function listItems() {
  return prisma.item.findMany({
    select: { id: true, name: true, age: true, role: true },
    orderBy: { id: 'asc' }
  });
}

export async function createItem(ownerId: number, data: { name: string; age: number; role: string }) {
  return prisma.item.create({
    data: { ...data, ownerId }
  });
}

export async function updateItem(id: number, data: Partial<{ name: string; age: number; role: string }>) {
  return prisma.item.update({
    where: { id },
    data
  });
}

export async function deleteItem(id: number) {
  return prisma.item.delete({
    where: { id }
  });
}
