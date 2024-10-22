import React from "react";

import { format } from "date-fns";
import SizesClient from "./components/SizesClient";
import prismadb from "@/lib/prismadb";
import { SizesColumn } from "./components/Columns";

const Sizes = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await prismadb.sizes.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizesColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    value: item.value,
  }));

  return (
    <div className="flex-col space-y-4 p-8 pt-6">
      <SizesClient data={formattedSizes} />
    </div>
  );
};

export default Sizes;
