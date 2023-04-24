
import { Pool } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

interface Order {
  id: number;
  bookId: string;
  clientName: string;
  clientEmail: string;
  status: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  const requestData = await request.json();

  const { bookId, clientName, clientEmail } = requestData;
  if (!bookId || !clientName) {
    return new NextResponse(JSON.stringify({ "error": "Invalid request parameters" }), { status: 400 });
  }

  try {
    const { rows } = await pool.query(`INSERT INTO orders (bookId, clientName, clientEmail) VALUES ($1, $2, $3) RETURNING *`, [bookId, clientName, clientEmail]);
    const order: Order = {
      id: rows[0].id,
      bookId: rows[0].bookId,
      clientName: rows[0].clientName,
      clientEmail: rows[0].clientEmail,
      status: rows[0].status,
    };

    const content = JSON.stringify(order);
    return new NextResponse(content);
  } catch (error) {
    return new NextResponse(JSON.stringify({ "error": "Internal Server Error" }), { status: 500 });
  } finally {
    await pool.end();
  }
}

export const runtime = 'edge';
