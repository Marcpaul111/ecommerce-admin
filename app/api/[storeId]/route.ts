import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// UPDATE

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
  }
) {
    try {
        const {userId } = auth();
        const body = await req.json();

        const {name} = body;

        if (!userId) {
            return new NextResponse('Unauthenticated', {status : 401})
        }

        if (!name) {
            return new NextResponse('Name is required', {status: 400})
        }

        if (!params.storeId) {
            return new NextResponse('StoreId is required', {status: 400})
        }

        const store = await prismadb.store.updateMany({
            where :{
                id: params.storeId,
                userId,
            },
            data: {
                name,
            }
        })

        return NextResponse.json(store)

    } catch (error) {
        console.error('[STORES_PATCH] Detailed error:', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
        return new NextResponse(`Internal Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
    }
}

// DELETE
export async function DELETE(
    req: Request,
    {
      params,
    }: {
      params: { storeId: string };
    }
  ) {
      try {
          const {userId } = auth();
         
  
          if (!userId) {
              return new NextResponse('Unauthenticated', {status : 401})
          }
  
  
          if (!params.storeId) {
              return new NextResponse('StoreId is required', {status: 400})
          }
  
          const store = await prismadb.store.deleteMany({
              where :{
                  id: params.storeId,
                  userId,
              },
          })
  
          return NextResponse.json(store)
  
      } catch (error) {
          console.error('[STORES_DELETE] Detailed error:', error);
          if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
          }
          return new NextResponse(`Internal Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
      }
  }
