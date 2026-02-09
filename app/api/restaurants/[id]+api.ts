import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { id }: { id: string }) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      return Response.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    return Response.json(restaurant);
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Failed to fetch restaurant' }, { status: 500 });
  }
}
