import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// UPDATE
export async function PATCH(
    req: Request,
    {
      params,
    }: {
      params: { storeId: string }
    }
  ) {
    try {
      const { userId } = auth()
      const body = await req.json()
  
      const { name, logoUrl, imageUrls, facebookUrl, twitterUrl, instagramUrl } = body
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 401 })
      }
  
      if (!params.storeId) {
        return new NextResponse("StoreId is required", { status: 400 })
      }
  
      // Update store name and logo
      const storeUpdate: any = {}
      if (name !== undefined) storeUpdate.name = name
      if (logoUrl !== undefined) storeUpdate.logoUrl = logoUrl
      if (facebookUrl !== undefined) storeUpdate.facebookUrl = facebookUrl
      if (twitterUrl !== undefined) storeUpdate.twitterUrl = twitterUrl
      if (instagramUrl !== undefined) storeUpdate.instagramUrl = instagramUrl
  
      // Always update the store, even if only to remove the logo
      await prismadb.store.update({
        where: {
          id: params.storeId,
          userId,
        },
        data: storeUpdate,
      })
  
      // Update banner images
      if (imageUrls !== undefined) {
        // First, delete existing images
        await prismadb.storeImage.deleteMany({
          where: {
            storeId: params.storeId,
          },
        })
  
        // Then, create new images (if any)
        if (imageUrls.length > 0) {
          await prismadb.storeImage.createMany({
            data: imageUrls.map((url: string) => ({
              storeId: params.storeId,
              url,
            })),
          })
        }
      }
  
      const updatedStore = await prismadb.store.findUnique({
        where: {
          id: params.storeId,
          userId,
        },
        include: {
          images: true,
        },
      })
  
      return NextResponse.json(updatedStore)
    } catch (error) {
      console.error("[STORES_PATCH] Detailed error:", error)
      if (error instanceof Error) {
        console.error("Error message:", error.message)
        console.error("Error stack:", error.stack)
      }
      return new NextResponse(`Internal Error: ${error instanceof Error ? error.message : "Unknown error"}`, {
        status: 500,
      })
    }
  }

// DELETE (unchanged)
export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string }
  }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 })
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    console.error("[STORES_DELETE] Detailed error:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    return new NextResponse(`Internal Error: ${error instanceof Error ? error.message : "Unknown error"}`, {
      status: 500,
    })
  }
}