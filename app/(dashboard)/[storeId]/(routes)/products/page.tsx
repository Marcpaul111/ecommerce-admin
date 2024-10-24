import React from "react";

import {format} from 'date-fns'
import ProductClient from "./components/ProductClient";
import prismadb from "@/lib/prismadb";
import { ProductColumn } from "./components/Columns";
import { formatter } from "@/lib/utils";

const Products = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.products.findMany({
    where: {
      storeId: params.storeId,
    },
    include:{
      category: true,
      size: true,
      color: true,
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    imageUrl: item.images[0].url,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex-col space-y-4 p-8 pt-6">
      <ProductClient data={formattedProducts}/>
    </div>
  );
};

export default Products;
