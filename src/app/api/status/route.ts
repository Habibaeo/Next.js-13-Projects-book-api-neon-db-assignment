import { NextResponse, NextRequest } from 'next/server';
import { Pool } from '@neondatabase/serverless';


async function checkApiAvailability() {
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

  try {
    await pool.connect();
    return  new NextResponse(JSON.stringify({
      status: 'Ok'
    }));
  } catch (error) {
    console.error('Error checking API availability:', error);
    return false;
  }
}

