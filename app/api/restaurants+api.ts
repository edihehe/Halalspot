import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      orderBy: { name: 'asc' }
    });
    return Response.json(restaurants);
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
  }
}
