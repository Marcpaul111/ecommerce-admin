import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// UPDATE

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
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
      return new NextResponse("Store Id is required.", {status: 400});
    }

    //   CHECK THE STORE BY THE USERID
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

    // INSERT THE BANNER TO DB
    const category = await prismadb.category.create({
      data: {
        name,
        bannerId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORIES_POST] Detailed error:", error);
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
        return new NextResponse("Store Id is required.");
      }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES_GET] Detailed error:", error);
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
