import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { productIds } = await req.json();

    if (!productIds || productIds.length === 0) {
      return NextResponse.json({ error: "Product IDs are required" }, { status: 400, headers: corsHeaders });
    }

    const products = await prismadb.products.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach((product) => {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "PHP",
          product_data: {
            name: product.name,
          },
          unit_amount: Math.round(product.price.toNumber() * 100),
        },
      });
    });

    const order = await prismadb.orders.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        orderItem: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId
              }
            }
          }))
        }
      }
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.STORE_FRONT_URL}/cart?success=1`,
      cancel_url: `${process.env.STORE_FRONT_URL}/cart?canceled=1`,
      metadata: {
        orderId: order.id
      }
    });

    return NextResponse.json({ url: session.url }, { headers: corsHeaders });
  } catch (error) {
    console.error('[CHECKOUT_ERROR]', error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500, headers: corsHeaders });
  }
}