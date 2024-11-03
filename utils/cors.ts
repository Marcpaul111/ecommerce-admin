import { NextResponse } from 'next/server';
import Cors from 'cors';

const cors = Cors({
  methods: ['GET', 'POST', 'DELETE', 'HEAD'],
  origin: '*', // Configure this based on your needs
  credentials: true,
});

function runMiddleware(req: Request, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function corsMiddleware(
  request: Request,
  handler: (request: Request) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    await runMiddleware(request, cors);
    return await handler(request);
  } catch (error) {
    console.error('CORS Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}