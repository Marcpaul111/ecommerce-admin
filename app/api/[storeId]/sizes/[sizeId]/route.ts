import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET
export async function GET(
    req: Request,
    {
      params,
    }: {
      params: { sizeId: string };
    }
  ) {
    try {
      const size = await prismadb.sizes.findUnique({
        where: {
          id: params.sizeId,
        },
      });
  
      return NextResponse.json(size);
    } catch (error) {
      console.error("[SIZE_GET] Detailed error:", error);
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
    params: { storeId: string; sizeId: string };
  }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
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

    const size = await prismadb.sizes.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error("[SIZE_PATCH] Detailed error:", error);
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
    params: { storeId: string; sizeId: string };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size Id is required", { status: 400 });
    }

    const size = await prismadb.sizes.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error("[SIZE_DELETE] Detailed error:", error);
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


