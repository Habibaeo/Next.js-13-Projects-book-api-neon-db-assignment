import { Pool } from '@neondatabase/serverless';

interface Order {
  id: string;
  bookId: string;
  clientName: string;
  status: string;
}

export async function handleRequest(request: Request): Promise<Response> {
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  const requestData = await request.json();

  const { bookId, clientName } = requestData;
  if (!bookId || !clientName) {
    return new Response(JSON.stringify({ "error": "Invalid request parameters" }), { status: 400 });
  }

  const clientEmail = requestData.clientEmail || '';

  try {
    const { rows } = await pool.query(`INSERT INTO orders (book_id, client_name, client_email) VALUES ($1, $2, $3) RETURNING *`, [bookId, clientName, clientEmail]);
    const order: Order = {
      id: rows[0].id,
      bookId: rows[0].book_id,
      clientName: rows[0].client_name,
      status: rows[0].status
    };

    const content = JSON.stringify(order);
    return new Response(content);
  } catch (error) {
    return new Response(JSON.stringify({ "error": "Internal Server Error" }), { status: 500 });
  } finally {
    await pool.end();
  }
}

export const runtime = 'edge';
