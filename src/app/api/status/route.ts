import { NextResponse, NextRequest } from 'next/server';
import { Pool } from '@neondatabase/serverless';

// async function checkApiAvailability() {
//   const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

//   try {
//     const { rows } = await pool.query('SELECT NOW()');
//     return true;
//   } catch (error) {
//     console.error('Error checking API availability:', error);
//     return false;
//   }
// }

// export async function GET(request: NextRequest) {
//   const apiAvailability = await checkApiAvailability();

//   if (apiAvailability) {
//     return new NextResponse(JSON.stringify({
//       status: 'Ok'
//     }));
//   } else {
//     return new NextResponse(JSON.stringify({
//       status: 'Error',
//       message: 'Unable to connect to the API'
//     }));
//   }
// }


async function checkApiAvailability() {
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

  try {
    await pool.connect();
    return true;
  } catch (error) {
    console.error('Error checking API availability:', error);
    return false;
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
    }), { status: 500 });
  }
}
