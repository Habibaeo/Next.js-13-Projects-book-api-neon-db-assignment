import { NextResponse, NextRequest } from 'next/server';
export async function GET(request: NextRequest) {
  return new NextResponse(JSON.stringify({
    status: 'Ok'
  }));
}