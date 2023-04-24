import { Pool } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest, { params }: { params: { orderId: string } }) {
  const orderId = params.orderId;
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

  try {
    const result = await pool.query('DELETE FROM orders WHERE id=$1', [orderId]);
    if (result.rowCount === 0) {
      return new NextResponse(JSON.stringify({ error: `Order with id ${orderId} not found` }), { status: 404 });
    }
    return new NextResponse(JSON.stringify({ message: `Order with id ${orderId} deleted successfully` }));
  } catch (error:any) {
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export const runtime = 'edge';
