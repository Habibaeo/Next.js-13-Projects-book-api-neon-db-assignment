import { Pool } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

interface Order {
  id: number;
  book_id: string;
  client_name: string;
  client_email: string;
  status: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  const requestData = await request.json();

  const { book_id, client_name, client_email } = requestData;
  if (!book_id || !client_name) {
    return new NextResponse(JSON.stringify({ "error": "Invalid request parameters" }), { status: 400 });
  }

  try {
    const { rows } = await pool.query(`INSERT INTO orders (book_id, client_name, client_email) VALUES ($1, $2, $3) RETURNING *`, [book_id, client_name, client_email]);
    const order: Order = {
      id: rows[0].id,
      book_id: rows[0].book_id,
      client_name: rows[0].client_name,
      client_email: rows[0].client_email,
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
