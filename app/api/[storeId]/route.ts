import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// UPDATE
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      logoUrl,
      facebookUrl,
      twitterUrl,
      instagramUrl,
      imageUrls,
      mobileImageUrls,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    // Update store properties
    const storeUpdate: any = {};
    if (name) storeUpdate.name = name;
    if (logoUrl) storeUpdate.logoUrl = logoUrl;
    if (facebookUrl) storeUpdate.facebookUrl = facebookUrl;
    if (twitterUrl) storeUpdate.twitterUrl = twitterUrl;
    if (instagramUrl) storeUpdate.instagramUrl = instagramUrl;

    await prismadb.store.update({
      where: {
        id: params.storeId,
        userId,
      },
      data: storeUpdate,
    });

    // Handle desktop images
    if (imageUrls && imageUrls.length > 0) {
      // Delete existing desktop images
      await prismadb.storeImage.deleteMany({
        where: {
          storeId: params.storeId,
        },
      });

      // Create new desktop images
      await prismadb.storeImage.createMany({
        data: imageUrls.map((url: string) => ({
          storeId: params.storeId,
          url,
        })),
      });
    }

    // Handle mobile images
    if (mobileImageUrls && mobileImageUrls.length > 0) {
      // Delete existing mobile images
      await prismadb.mobileImage.deleteMany({
        where: {
          storeId: params.storeId,
        },
      });

      // Create new mobile images
      await prismadb.mobileImage.createMany({
        data: mobileImageUrls.map((url: string) => ({
          storeId: params.storeId,
          mobileUrl: url,
        })),
      });
    }

    // Fetch the updated store data with both types of images
    const updatedStore = await prismadb.store.findUnique({
      where: {
        id: params.storeId,
        userId,
      },
      include: {
        images: true,
        mobileImages: true,
      },
    });

    return NextResponse.json(updatedStore);
  } catch (error) {
    console.error("[STORES_PATCH] Detailed error:", error);
    return new NextResponse(
      `Internal Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 }
    );
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

// Get
export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
  }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store Id is required.", { status: 400 });
    }

    const store = await prismadb.store.findUnique({
      where: {
        id: params.storeId,
      },
      include: {
        images: true,    // This includes StoreImage
        mobileImages: true,  // This includes MobileImage
      }
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error("[STORE_GET] Detailed error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return new NextResponse(
      `Internal Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
}