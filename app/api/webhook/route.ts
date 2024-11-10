import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { resend } from "@/lib/resend";
import ReceiptEmail from "@/emails/receipt-email";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_KEY!
    );
  } catch (error: any) {
    console.error('Error verifying webhook:', error.message);
    return new NextResponse(`Webhook error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  
  if (event.type === "checkout.session.completed") {
    const address = session?.customer_details?.address;
    const email = session?.customer_details?.email;

    const addressComponents = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.state,
      address?.postal_code,
      address?.country,
    ];

    const addressString = addressComponents.filter((c) => c !== null).join(", ");

    try {
      // Fetch the payment intent to get receipt URL
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent as string
      );

      // Get the receipt URL from the latest charge
      const receiptUrl = paymentIntent.latest_charge 
        ? (await stripe.charges.retrieve(paymentIntent.latest_charge as string)).receipt_url 
        : null;

      const updatedOrder = await prismadb.orders.update({
        where: {
          id: session?.metadata?.orderId,
        },
        data: {
          isPaid: true,
          address: addressString,
          phone: session?.customer_details?.phone || '',
          email: email || '',
          receiptUrl: receiptUrl || '',
        },
        include: {
          orderItem: {
            include: {
              product: true
            }
          }
        }
      });

      // Prepare products data for email
      const products = updatedOrder.orderItem.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: Number(item.product.price),
      }));

      // Send receipt email
      if (email) {
        await resend.emails.send({
          from: "Your Store <orders@yourdomain.com>",
          to: email,
          subject: `Order Confirmation #${updatedOrder.id}`,
          react: ReceiptEmail({
            email,
            date: updatedOrder.createdAt,
            orderNumber: updatedOrder.id,
            products,
            totalAmount: updatedOrder.totalPrice,
            receiptUrl: receiptUrl || '',
          }) as React.ReactElement,
        });
      }

      // Archive products
      const productIds = updatedOrder.orderItem.map((item) => item.product.id);
      await prismadb.products.updateMany({
        where: {
          id: {
            in: productIds
          }
        },
        data: {
          isArchived: true
        }
      });

    } catch (error) {
      console.error('Error processing order:', error);
      return new NextResponse('Error processing order', { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}