import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET
export async function GET(
    req: Request,
    {
      params,
    }: {
      params: { bannerId: string };
    }
  ) {
    try {
      const banner = await prismadb.banners.findUnique({
        where: {
          id: params.bannerId,
        },
      });
  
      return NextResponse.json(banner);
    } catch (error) {
      console.error("[BANNER_DELETE] Detailed error:", error);
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

// UPDATE

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string; bannerId: string };
  }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 400 });
    }

    const storeUserById = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    //NOT ALLOWING OTHER USERS TO SAVE CHANGES TO THE ORIGINAL ADMIN
    if (!storeUserById) {
      return new NextResponse("Unauthorize", { status: 403 });
    }

    const banner = await prismadb.banners.updateMany({
      where: {
        id: params.bannerId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("[BANNER_PATCH] Detailed error:", error);
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

// DELETE
export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string; bannerId: string };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.bannerId) {
      return new NextResponse("Banner Id is required", { status: 400 });
    }

    const banner = await prismadb.banners.deleteMany({
      where: {
        id: params.bannerId,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("[BANNER_DELETE] Detailed error:", error);
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


