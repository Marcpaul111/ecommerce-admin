import prismadb from "@/lib/prismadb";
// import corsMiddleware from "@/utils/cors";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { 
      name, 
      price, 
      colorId, 
      sizeId, 
      categoryId, 
      description, 
      images, 
      isFeatured, 
      isNew, 
      isArchived 
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images?.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }
    
    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color ID is required", { status: 400 });
    }

    if (!description) {
      return new NextResponse("Description is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const storeUserById = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeUserById) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prismadb.products.create({
      data: {
        name,
        price: parseFloat(price.toString()),
        categoryId,
        sizeId,
        colorId,
        description,
        storeId: params.storeId,
        isFeatured: Boolean(isFeatured),
        isNew: Boolean(isNew),
        isArchived: Boolean(isArchived),
        images: {
          createMany: {
            data: [...images].map((url: string) => ({ url })),
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    const isNew = searchParams.get("isNew");
    
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const products = await prismadb.products.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured === "true" ? true : undefined,
        isNew: isNew === "true" ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const storeUserById = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeUserById) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prismadb.products.deleteMany({
      where: {
        id: params.productId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}