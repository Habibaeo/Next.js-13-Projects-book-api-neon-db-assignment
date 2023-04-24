import { Pool } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';


interface ApiClient {
  id: number;
  clientName: string;
  clientEmail: string;
  accessPermissions: string[];
}

interface ApiClientToken {
  id: number;
  apiClientId: number;
  accessToken: string;
  jwtToken: string; // add a field for JWT token
}

// ...

export async function POST(request: Request) {
  const { clientName, clientEmail }: ApiClient = await request.json();

  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

  // Insert new api_client row
  const { rows: [apiClient] } = await pool.query(
    `INSERT INTO api_clients (clientName, clientEmail) VALUES ($1, $2) RETURNING *`,
    [clientName, clientEmail],
  );

  // Generate and insert new api_client_token row
  const jwtToken = jwt.sign(
    { apiClientId: apiClient.id, clientName, clientEmail, accessPermissions: ['/orders'] },
    process.env.JWT_SECRET as string, // use your JWT secret here
    { expiresIn: '1h' } // optional: set token expiration time
  );
  const { rows: [apiClientToken] } = await pool.query(
    `INSERT INTO api_client_tokens (apiClientId, accessToken, jwtToken) VALUES ($1, $2, $3) RETURNING *`,
    [apiClient.id, '', jwtToken],
  );

  const responseBody = JSON.stringify({
    message: "API client and token successfully created",
    data: {
      apiClient,
      apiClientToken,
    },
  });

  return new Response(responseBody);
}








// interface ApiClient {
//   id: number;
//   clientName: string;
//   clientEmail: string;
// }

// interface ApiClientToken {
//   id: number;
//   apiClientId: number;
//   accessToken: string;
// }

// export async function POST(request: Request) {
//   console.log(`My API request: Trying to Post ${JSON.stringify(request)}`)
//     const { clientName, clientEmail }:ApiClient = await request.json();

//   const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

//   // Insert new api_client row
//   const { rows: [apiClient] } = await pool.query(
//     `INSERT INTO api_clients (clientName, clientEmail) VALUES ($1, $2) RETURNING *`,
//     [clientName, clientEmail],
//   );

//   // Generate and insert new api_client_token row
//   const accessToken = Math.random().toString(36).substring(7);
//   const { rows: [apiClientToken] } = await pool.query(
//     `INSERT INTO api_client_tokens (apiClientId, accessToken) VALUES ($1, $2) RETURNING *`,
//     [apiClient.id, accessToken],
//   );

//   const responseBody = JSON.stringify({
//     message: "API client and token successfully created",
//     data: {
//       apiClient,
//       apiClientToken,
//     },
//   });

//   return new Response(responseBody);
// }


// export const runtime = 'edge';