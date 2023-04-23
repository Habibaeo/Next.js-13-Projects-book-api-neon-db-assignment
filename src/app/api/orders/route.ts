import { Pool } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

interface Order {
  id: string;
  bookId: string;
  customerName: string;
  
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  const requestData = await request.json();

  const { bookId, customerName } = requestData;
  if (!bookId || !customerName) {
    return new NextResponse(JSON.stringify({ "error": "Invalid request parameters" }), { status: 400 });
  }

  try {
    const { rows } = await pool.query(`INSERT INTO orders (bookId, clientName) VALUES ($1, $2, $3) RETURNING *`, [bookId, customerName]);
    const orders: Order = {
      id: rows[0].id,
      bookId: rows[0].bookId,
      customerName: rows[0].customerName,
   
    };

    const content = JSON.stringify(orders);
    return new NextResponse(content);
  } catch (error) {
    return new NextResponse(JSON.stringify({ "error": "Internal Server Error" }), { status: 500 });
  } finally {
    await pool.end();
  }
}

export const runtime = 'edge';

