import { Pool } from '@neondatabase/serverless';
import { NextResponse, NextRequest } from 'next/server';

interface Order {
  id: string;
  bookId: number;
  customerName: string;
  created: boolean;
  createdBy: string;
  quantity: number;
  timestamp: number;
}

interface Book {
  id: number;
  name: string;
  price: number;
}

export async function GET(request: NextRequest) {
  try {
    const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

    // Retrieve all orders from the orders table
    const { rows: orders } = await pool.query<Order>('SELECT * FROM orders');

    // If no orders found, return an error response
    if (orders.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'No orders found' }), { status: 404 });
    }

    // Retrieve book information for each order
    const bookIds = [...new Set(orders.map(order => order.bookId))];
    let books: Book[] = [];

    if (bookIds.length > 0) {
      const { rows } = await pool.query<Book>('SELECT * FROM books WHERE id IN (' + bookIds.join(',') + ')');
      books = rows;
    }

    // If no books found for the orders, return an error response
    if (books.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'No books found for the orders' }), { status: 404 });
    }

    // Join the order and book information
    const orderData = orders.map(order => {
      const book = books.find(book => book.id === order.bookId);
      const price = book ? book.price : 0;
      const total = order.quantity * price;

      return {
        id: order.id,
        bookName: book ? book.name : '',
        quantity: order.quantity,
        pricePerUnit: price,
        totalPrice: total
      };
      
    });
    console.log(orderData);
    return new NextResponse(JSON.stringify(orderData));

  } catch (error: any) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error: ' + error.message }), { status: 500 });
  }
}

export const runtime = 'edge';


// import { Pool } from '@neondatabase/serverless';

// interface Book {
//   id: string;
//   name: string;
//   author: string;
//   isbn: number|null;
//   type: string;
//   price: number;
//   currentStock: number;
//   available: boolean;
// }

// export async function GET(request: Request) {
//   const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
//   const { rows } = await pool.query(`SELECT * FROM books`);

//   let content: string;

//   console.log(rows);
//   if (!rows || rows.length === 0) {
//     content = JSON.stringify({
//       "error": "No books found"
//     });
//   } else {
//     const books: Book[] = rows.map((row: any) => ({
//       id: row.id,
//       name: row.name,
//       author: row.author,
//       isbn: row.isbn,
//       type: row.type,
//       price: row.price,
//       currentStock: row.current_stock,
//       available: row.available
//     }));
//     content = JSON.stringify(books);
//   }
//   // event.waitUntil(pool.end());  // doesn't hold up the response
//   return new Response(content);
// }

// export const runtime = 'edge';