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

export async function POST(request: NextRequest, { params }: {
  params: { id: string }
}) {
  const requestBody = await request.json();

  const bookId = requestBody.bookId;
  const customerName = requestBody.customerName;
  const quantity = requestBody.quantity;

  if (!bookId || !customerName || !quantity) {
    return new NextResponse(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  const order: Order = {
    id: Math.random().toString(36).substring(7),
    bookId: bookId,
    customerName: customerName,
    created: true,
    createdBy: 'API',
    quantity: quantity,
    timestamp: Math.floor(Date.now()/1000)
  };

  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
  await pool.query(`INSERT INTO orders (id, bookId, customerName, created, createdBy, quantity, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [order.id, order.bookId, order.customerName, order.created, order.createdBy, order.quantity, order.timestamp]);

  return new NextResponse(JSON.stringify({ message: 'Order successfully placed' }));
}



// Orders retrieval

interface Book {
  id: number;
  name: string;
  price: number;
}

export async function GET(request: NextRequest) {
  const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

  try {
    // Retrieve all orders from the orders table
    const { rows: orders } = await pool.query<Order>('SELECT * FROM orders');

    // Retrieve book information for each order
    const bookIds = [...new Set(orders.map(order => order.bookId))];
    const { rows: books } = await pool.query<Book>('SELECT * FROM books WHERE id IN (' + bookIds.join(',') + ')');

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

    return new NextResponse(JSON.stringify(orderData));
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export const runtime = 'edge';







// interface Book {
//   id: number;
//   name: string;
//   price: number;
// }

// export async function GET(request: NextRequest) {
//   const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

//   // Retrieve all orders from the orders table
//   const { rows: orders } = await pool.query<Order>('SELECT * FROM orders');

//   // Retrieve book information for each order
//   const bookIds = [...new Set(orders.map(order => order.bookId))];
//   const { rows: books } = await pool.query<Book>('SELECT * FROM books WHERE id IN (' + bookIds.join(',') + ')');

//   // Join the order and book information
//   const orderData = orders.map(order => {
//     const book = books.find(book => book.id === order.bookId);
//     const price = book ? book.price : 0;
//     const total = order.quantity * price;

//     return {
//       id: order.id,
//       bookName: book ? book.name : '',
//       quantity: order.quantity,
//       pricePerUnit: price,
//       totalPrice: total
//     };
//   });

//   return new NextResponse(JSON.stringify(orderData));
// }

// export const runtime = 'edge';






// import { Pool } from '@neondatabase/serverless';
// import { NextRequest, NextResponse } from 'next/server';

// interface Order {
//   id: number;
//   bookId: string;
//   clientName: string;
//   clientEmail: string;
//   status: string;
// }

// export async function POST(request: NextRequest): Promise<NextResponse> {
//   const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
//   const requestData = await request.json();

//   const { bookId, clientName, clientEmail } = requestData;
//   if (!bookId || !clientName) {
//     return new NextResponse(JSON.stringify({ "error": "Invalid request parameters" }), { status: 400 });
//   }

//   try {
//     const { rows } = await pool.query(`INSERT INTO orders (bookId, clientName, clientEmail) VALUES ($1, $2, $3) RETURNING *`, [bookId, clientName, clientEmail]);
//     const order: Order = {
//       id: rows[0].id,
//       bookId: rows[0].bookId,
//       clientName: rows[0].clientName,
//       clientEmail: rows[0].clientEmail,
//       status: rows[0].status,
//     };

//     const content = JSON.stringify(order);
//     return new NextResponse(content);
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ "error": "Internal Server Error" }), { status: 500 });
//   } finally {
//     await pool.end();
//   }
// }

// export const runtime = 'edge';
