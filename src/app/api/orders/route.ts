import { Pool } from '@neondatabase/serverless';

interface Order {
  id: string;
  bookId: number;
  customerName: string;
  created: boolean;
  createdBy: string;
  quantity: number;
  timestamp: number;
}

export async function POST(request: Request, { params }: {
  params: { id: string }
}) {
  const requestBody = await request.json();

  const bookId = requestBody.bookId;
  const customerName = requestBody.customerName;
  const quantity = requestBody.quantity;

  if (!bookId || !customerName || !quantity) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  const order: Order = {
    id: Math.random().toString(36).substring(7),
    bookId: bookId,
    customerName: customerName,
    created: true,
    createdBy: 'API',
    quantity: quantity,
    timestamp: Date.now()
  };

  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  await pool.query(`INSERT INTO orders (id, bookId, customerName, created, createdBy, quantity, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [order.id, order.bookId, order.customerName, order.created, order.createdBy, order.quantity, order.timestamp]);

  return new Response(JSON.stringify({ message: 'Order successfully placed' }));
}

export const runtime = 'edge';
