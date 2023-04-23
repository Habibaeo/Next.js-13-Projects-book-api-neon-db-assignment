import { Pool } from '@neondatabase/serverless';

interface Book {
  id: string;
  name: string;
  author: string;
  isbn: number|null;
  type: string;
  price: number;
  currentStock: number;
  available: boolean;
}

export async function GET(request: Request) {
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  const { rows } = await pool.query(`SELECT * FROM books`);

  let content: string;

  console.log(rows);
  if (!rows || rows.length === 0) {
    content = JSON.stringify({
      "error": "No books found"
    });
  } else {
    const books: Book[] = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      author: row.author,
      isbn: row.isbn,
      type: row.type,
      price: row.price,
      currentStock: row.current_stock,
      available: row.available
    }));
    content = JSON.stringify(books);
  }
  // event.waitUntil(pool.end());  // doesn't hold up the response
  return new Response(content);
}

export const runtime = 'edge';











// import { Pool } from '@neondatabase/serverless';
// import express from 'express';

// interface book {
//   id?: string;
//   name?: string;
//   author?: string;
//   isbn?: number | null;
//   type?: string;
//   price?: number;
//   currentStock?: number;
//   available?: boolean;
// }

// const app = express();

// app.get('/books', async (req, res) => {
//   const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

//   const { rows } = await pool.query('SELECT * FROM books');

//   res.json(rows);
// });

// app.listen(3000, () => {
//   console.log('Server is listening on port 3001');
// });

// export const runtime = 'edge';





// import { Pool } from '@neondatabase/serverless';
// //  import  Response  from "next/server";

// interface book {
//   id?:string
//   name?: string
//   author?: string
//   isbn?: number|null
//   type?: string
//   price?: number
//   currentStock?: number
//   available?: boolean
  
// }

// export async function GET(request: Request, { params }: {
//     params: book
//   }) {
    
//     const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
//     const { rows } = await pool.query(`SELECT * FROM books`);
    
//     let content: string;
    
//     console.log(rows);
//     // if (!rows || rows.length === 0) {
//     //     content = JSON.stringify({
//     //         "error":`No book with id ${params.id}`
//     //     });
//     // } else {
//     //     content = JSON.stringify(rows);
//     // }
//     // event.waitUntil(pool.end());  // doesn't hold up the response
//     return new Response(JSON.stringify(rows));
// }

// export const runtime = 'edge';