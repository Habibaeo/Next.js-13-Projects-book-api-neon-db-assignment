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
// Orders retrieval

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
      const { rows: books } = await pool.query<Book>('SELECT * FROM books WHERE id IN (' + bookIds.join(',') + ')');
  
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
  
      return new NextResponse(JSON.stringify(orderData));
    } 
    catch (error: any) {
      console.error(error);
      return new NextResponse(JSON.stringify({ error: 'Internal Server Error: ' + error.message }), { status: 500 });
    }
  }

  export const runtime = 'edge';

  