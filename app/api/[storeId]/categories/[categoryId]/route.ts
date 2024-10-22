import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET
export async function GET(
    req: Request,
    {
      params,
    }: {
      params: { categoryId: string, storeId:string };
    }
  ) {
    try {
      const category = await prismadb.category.findUnique({
        where: {
          id: params.categoryId,
        },
        include:{
          banner: true
        }
      });
  
      return NextResponse.json(category);
    } catch (error) {
      console.error("[CATEGORY_DELETE] Detailed error:", error);
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
    params: { storeId: string; categoryId: string };
  }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, bannerId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!bannerId) {
      return new NextResponse("Banner ID is required", { status: 400 });
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

    const categories = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        bannerId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES_PATCH] Detailed error:", error);
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
    params: { storeId: string; categoryId: string };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category Id is required", { status: 400 });
    }

    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_DELETE] Detailed error:", error);
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


