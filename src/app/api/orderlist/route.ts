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

export async function GET(request: NextRequest, { params }: {
  params: { id: string }
}) {
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  const ordersResult = await pool.query('SELECT * FROM orders');

  const bookIds = ordersResult.rows.map((order) => order.bookId);
  const booksResult = await pool.query(`SELECT id, name, price FROM books WHERE id = ANY($1)`, [bookIds]);

  const books = booksResult.rows.reduce((obj, book) => {
    obj[book.id] = book;
    return obj;
  }, {});

  const orders = ordersResult.rows.map((order) => {
    const book = books[order.bookId];
    const price = book.price;
    const totalPrice = price * order.quantity;
    return {
      id: order.id,
      bookName: book.name,
      quantity: order.quantity,
      pricePerUnit: price,
      totalPrice: totalPrice
    }
  });

  return new NextResponse(JSON.stringify(orders));
}

export const runtime = 'edge';
















// import { Pool } from '@neondatabase/serverless';
// import { NextResponse, NextRequest } from 'next/server';

// interface Order {
//   id: string;
//   bookId: number;
//   customerName: string;
//   created: boolean;
//   createdBy: string;
//   quantity: number;
//   timestamp: number;
// }

// interface Book {
//   id: number;
//   name: string;
//   price: number;
// }

// export async function GET(request: NextRequest, { params }: {
//   params: { id: string }
// }) {
//   const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
//   const ordersResult = await pool.query('SELECT * FROM orders');

//   const bookIds = ordersResult.rows.map((order) => order.bookId).join(',');
//   const booksResult = await pool.query(`SELECT id, name, price FROM books WHERE id IN (${bookIds})`);

//   const orders = ordersResult.rows.map((order) => {
//     const book = booksResult.rows.find((book) => book.id === order.bookId);
//     const price = book.price;
//     const totalPrice = price * order.quantity;
//     return {
//       id: order.id,
//       bookName: book.name,
//       quantity: order.quantity,
//       pricePerUnit: price,
//       totalPrice: totalPrice
//     }
//   });

//   return new NextResponse(JSON.stringify(orders));
// }

// export const runtime = 'edge';











// // import { Pool } from '@neondatabase/serverless';
// // import { NextResponse, NextRequest } from 'next/server';

// // interface Order {
// //   id: string;
// //   bookId: number;
// //   customerName: string;
// //   created: boolean;
// //   createdBy: string;
// //   quantity: number;
// //   timestamp: number;
// // }

// // interface Book {
// //   id: number;
// //   name: string;
// //   price: number;
// // }

// // export async function GET(request: NextRequest) {
// //   try {
// //     const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

// //     // Retrieve all orders from the orders table
// //     const { rows: orders } = await pool.query<Order>('SELECT * FROM orders');

// //     // If no orders found, return an error response
// //     if (orders.length === 0) {
// //       return new NextResponse(JSON.stringify({ error: 'No orders found' }), { status: 404 });
// //     }

// //     // Retrieve book information for each order
// //     const bookIds = [...new Set(orders.map(order => order.bookId))];
// //     let books: Book[] = [];

// //     if (bookIds.length > 0) {
// //       const { rows } = await pool.query<Book>('SELECT * FROM books WHERE id IN (' + bookIds.join(',') + ')');
// //       books = rows;
// //     }

// //     // If no books found for the orders, return an error response
// //     if (books.length === 0) {
// //       return new NextResponse(JSON.stringify({ error: 'No books found for the orders' }), { status: 404 });
// //     }

// //     // Join the order and book information
// //     const orderData = orders.map(order => {
// //       const book = books.find(book => book.id === order.bookId);
// //       const price = book ? book.price : 0;
// //       const total = order.quantity * price;

// //       return {
// //         id: order.id,
// //         bookName: book ? book.name : '',
// //         quantity: order.quantity,
// //         pricePerUnit: price,
// //         totalPrice: total
// //       };
      
// //     });
// //     console.log(orderData);
// //     return new NextResponse(JSON.stringify(orderData));

// //   } catch (error: any) {
// //     console.error(error);
// //     return new NextResponse(JSON.stringify({ error: 'Internal Server Error: ' + error.message }), { status: 500 });
// //   }
// // }

// // export const runtime = 'edge';

