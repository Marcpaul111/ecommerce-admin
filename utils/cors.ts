import { NextResponse, type NextRequest } from "next/server";


export function middleware(req: NextRequest) {
  console.log(req.nextUrl);

  const response = NextResponse.next();
  
  response.headers.append("ALLOW-ACCESS-CONTROL-ORIGIN", '*')
  response.headers.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.append("Access-Control-Allow-Headers", "Content-Type");
  return response;

  
}

export const config = {
  matcher: ['/api/:path*'],
}