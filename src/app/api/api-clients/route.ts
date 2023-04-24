import { Pool } from '@neondatabase/serverless';

interface ApiClient {
  id: number;
  clientName: string;
  clientEmail: string;
}

interface ApiClientToken {
  id: number;
  apiClientId: number;
  accessToken: string;
}

export async function POST(request: Request) {
  console.log(JSON.stringify(request))
    const { clientName, clientEmail } = await request.json();

  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

  // Insert new api_client row
  const { rows: [apiClient] } = await pool.query(
    `INSERT INTO api_clients (clientName, clientEmail) VALUES ($1, $2) RETURNING *`,
    [clientName, clientEmail],
  );

  // Generate and insert new api_client_token row
  const accessToken = Math.random().toString(36).substring(7);
  const { rows: [apiClientToken] } = await pool.query(
    `INSERT INTO api_client_tokens (apiClientId, accessToken) VALUES ($1, $2) RETURNING *`,
    [apiClient.id, accessToken],
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

 export const methods = ['POST'];
// export const next = '/api-clients';
export const runtime = 'edge';