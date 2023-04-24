import { Pool } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const orderId = params.id;
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

  const result = await pool.query('DELETE FROM orders WHERE id=$1 RETURNING *', [orderId]);
  const deletedOrder = result.rows[0];

  if (!deletedOrder) {
    return new NextResponse(JSON.stringify({ error: `Order with id ${orderId} not found` }), { status: 404 });
  }

  return new NextResponse(JSON.stringify({ message: `Order with id ${orderId} successfully deleted` }));
}

export const runtime = 'edge';
