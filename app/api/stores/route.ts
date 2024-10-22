import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;

    console.log('Received request body:', body);
    console.log('Extracted name:', name);
    console.log('User ID:', userId);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId
      }
    });

    console.log('Created store:', store);
    return NextResponse.json(store);
  } catch (error) {
    console.error('[STORES_POST] Detailed error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return new NextResponse(`Internal Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}