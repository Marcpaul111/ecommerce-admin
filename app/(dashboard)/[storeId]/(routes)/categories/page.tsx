import React from "react";

import {format} from 'date-fns'
import CategoryClient from "./components/CategoryClient";
import prismadb from "@/lib/prismadb";
import { CategoryColumn } from "./components/Columns";

const Categories = async ({ params }: { params: { storeId: string } }) => {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include:{
      banner: true
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    bannerLabel: item.banner.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  
  }))

  return (
    <div className="flex-col space-y-4 p-8 pt-6">
      <CategoryClient data={formattedCategories}/>
    </div>
  );
};

export default Categories;
