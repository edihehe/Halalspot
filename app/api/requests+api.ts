import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, cuisine, address, description, isBusiness, email } = body;

    const newRequest = await prisma.restaurantRequest.create({
      data: {
        name,
        cuisine,
        address,
        description,
        isBusiness: !!isBusiness,
        email,
      },
    });

    return Response.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('API Post Request Error:', error);
    return Response.json({ error: 'Failed to create request' }, { status: 500 });
  }
}
