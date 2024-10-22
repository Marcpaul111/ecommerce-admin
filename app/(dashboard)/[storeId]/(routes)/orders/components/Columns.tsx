"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";



export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  totalPrice:string;
  isPaid: boolean;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ row }) => {
      const isPaid = row.getValue<boolean>("isPaid");
      return isPaid ? (
        <Badge className="bg-green-500 text-white animate-pulse">Paid</Badge>
      ) : (
        <Badge className="bg-red-500 text-white animate-pulse">Not Paid</Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
 
];
