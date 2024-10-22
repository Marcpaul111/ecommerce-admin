"use client";


import Heading from '@/components/ui/Heading'
import { Separator } from '@/components/ui/separator'

import React from "react";
import { OrderColumn, columns } from "./Columns";
import { DataTable } from "@/components/ui/DataTable";


interface OrderClientProps {
  data: OrderColumn[];
}

const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  

  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage your orders for you store"
      />

      <Separator />

      <DataTable searchKey="products" columns={columns} data={data} />
     
    </>
  );
};

export default OrderClient;
