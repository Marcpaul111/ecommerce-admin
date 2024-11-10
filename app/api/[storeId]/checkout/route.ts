import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface CartItem {
  id: string;
  quantity: number;
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const { items } = body as { items: CartItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const products = await prismadb.products.findMany({
      where: {
        id: {
          in: items.map(item => item.id)
        },
      },
      include: {
        images: {
          take: 1,
        },
      },
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let totalQuantity = 0;
    let totalAmount = 0;

    products.forEach((product) => {
      const cartItem = items.find(item => item.id === product.id);
      if (!cartItem) return;

      totalQuantity += cartItem.quantity;
      totalAmount += Number(product.price) * cartItem.quantity;

      line_items.push({
        quantity: cartItem.quantity,
        price_data: {
          currency: "PHP",
          product_data: {
            name: product.name,
            images: product.images[0] ? [product.images[0].url] : [],
          },
          unit_amount: Math.round(Number(product.price) * 100),
        },
      });
    });

    const order = await prismadb.orders.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        totalQuantity,
        totalPrice: Math.round(totalAmount),
        orderItem: {
          create: items.map(item => ({
            productId: item.id,
            quantity: item.quantity
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
        orderId: order.id,
        totalQuantity: totalQuantity.toString(),
        totalAmount: totalAmount.toString()
      }
    });

    return NextResponse.json({ url: session.url }, { headers: corsHeaders });
  } catch (error) {
    console.error('[CHECKOUT_ERROR]', error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500, headers: corsHeaders }
    );
  }
}