import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// CREATE

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

    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
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
    const banner = await prismadb.banners.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("[BANNERS_POST] Detailed error:", error);
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

// GET
// export async function GET(
//   req: Request,
//   {
//     params,
//   }: {
//     params: { storeId: string };
//   }
// ) {
//   try {
    
//     if (!params.storeId) {
//         return new NextResponse("Store Id is required.");
//       }

//     const banners = await prismadb.banners.findMany({
//       where: {
//         storeId: params.storeId,
//       },
//     });

//     return NextResponse.json(banners);
//   } catch (error) {
//     console.error("[BANNERS_GET] Detailed error:", error);
//     if (error instanceof Error) {
//       console.error("Error message:", error.message);
//       console.error("Error stack:", error.stack);
//     }
//     return new NextResponse(
//       `Internal Error: ${
//         error instanceof Error ? error.message : "Unknown error"
//       }`,
//       { status: 500 }
//     );
//   }
// }

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


