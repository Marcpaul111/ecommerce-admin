import React from "react";

import { format } from "date-fns";
import ColorClient from "./components/ColorClient";
import prismadb from "@/lib/prismadb";
import { ColorColumn } from "./components/Columns";

const Colors = async ({ params }: { params: { storeId: string } }) => {
  const colors = await prismadb.colors.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    value: item.value,
  }));

  return (
    <div className="flex-col space-y-4 p-8 pt-6">
      <ColorClient data={formattedColors} />
    </div>
  );
};

export default Colors;
