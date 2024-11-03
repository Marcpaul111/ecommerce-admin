import Cors from 'cors'
import { NextResponse } from 'next/server'

const cors = Cors({
  methods: ['GET', 'POST', 'DELETE', 'HEAD'],
})

function runMiddleware(
  request: Request,
  response: NextResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(request, response, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function corsMiddleware(
  request: Request,
  handler: (request: Request) => Promise<NextResponse>
): Promise<NextResponse> {
  const response = NextResponse.next()
  await runMiddleware(request, response, cors)
  return handler(request)
}