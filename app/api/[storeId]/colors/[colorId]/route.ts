import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET
export async function GET(
    req: Request,
    {
      params,
    }: {
      params: { colorId: string };
    }
  ) {
    try {
      const color = await prismadb.colors.findUnique({
        where: {
          id: params.colorId,
        },
      });
  
      return NextResponse.json(color);
    } catch (error) {
      console.error("[COLOR_GET] Detailed error:", error);
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
    params: { storeId: string; colorId: string };
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

    if (!params.colorId) {
      return new NextResponse("Color Id is required", { status: 400 });
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

    const color = await prismadb.colors.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error("[COLOR_PATCH] Detailed error:", error);
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
    params: { storeId: string; colorId: string };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.colorId) {
      return new NextResponse("Color Id is required", { status: 400 });
    }

    const color = await prismadb.colors.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error("[COLORS_DELETE] Detailed error:", error);
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


