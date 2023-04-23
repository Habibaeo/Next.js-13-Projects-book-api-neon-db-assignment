import { Pool } from '@neondatabase/serverless';

interface Order {
  id: string;
  bookId: string;
  customerName: string;
  
}

export async function POST(request: Request): Promise<Response> {
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  const requestData = await request.json();

  const { bookId, customerName } = requestData;
  if (!bookId || !customerName) {
    return new Response(JSON.stringify({ "error": "Invalid request parameters" }), { status: 400 });
  }

  try {
    const { rows } = await pool.query(`INSERT INTO orders (bookId, clientName) VALUES ($1, $2, $3) RETURNING *`, [bookId, customerName]);
    const orders: Order = {
      id: rows[0].id,
      bookId: rows[0].bookId,
      customerName: rows[0].customerName,
   
    };

    const content = JSON.stringify(orders);
    return new Response(content);
  } catch (error) {
    return new Response(JSON.stringify({ "error": "Internal Server Error" }), { status: 500 });
  } finally {
    await pool.end();
  }
}

export const runtime = 'edge';
