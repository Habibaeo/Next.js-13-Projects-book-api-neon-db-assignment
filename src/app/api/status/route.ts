import { NextResponse, NextRequest } from 'next/server';
import { Pool } from '@neondatabase/serverless';

async function checkApiAvailability() {
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

  try {
    const { rows } = await pool.query('SELECT NOW()');
    return rows[0].now;
  } catch (error) {
    console.error('Error checking API availability:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const apiAvailability = await checkApiAvailability();

  if (apiAvailability) {
    return new NextResponse(JSON.stringify({
      status: 'Ok'
    }));
  } else {
    return new NextResponse(JSON.stringify({
      status: 'Error',
      message: 'Unable to connect to the API'
    }));
  }
}
