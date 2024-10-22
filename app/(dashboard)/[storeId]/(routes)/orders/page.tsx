import React from "react";

import {format} from 'date-fns'
import OrderClient from "./components/OrderClient";
import prismadb from "@/lib/prismadb";
import { OrderColumn } from "./components/Columns";
import { formatter } from "@/lib/utils";
import { number } from "zod";

const Orders = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.orders.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItem: {
        include: {
          product: true
        }

      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItem.map((item) => item.product.name).join(", "),
    totalPrice: formatter.format(item.orderItem.reduce((total, item) => {
      return total + Number(item.product.price)
    },0)),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex-col space-y-4 p-8 pt-6">
      <OrderClient data={formattedOrders}/>
    </div>
  );
};

export default Orders;
