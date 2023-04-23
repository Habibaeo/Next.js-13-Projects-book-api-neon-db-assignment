import { Pool } from '@neondatabase/serverless';

interface book {
  id:string
  name: string
  author: string
  isbn: number|null
  type: string
  price: number
  currentStock: number
  available: boolean
  
}




export async function GET(request: Request, { params }: {
    params: { id: string }
  }) {
    
    const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
    const { rows } = await pool.query(`SELECT * FROM books WHERE id = ${params.id}`);
    
    let content: string;
    
    console.log(rows);
    if (!rows || rows.length === 0) {
        content = JSON.stringify({
            "error":`No book with id ${params.id}`
        });
    } else {
        content = JSON.stringify(rows[0]);
    }
    // event.waitUntil(pool.end());  // doesn't hold up the response
    return new Response(content);
}

export const runtime = 'edge';