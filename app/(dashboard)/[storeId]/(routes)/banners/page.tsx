import React from "react";

import {format} from 'date-fns'
import BannerClient from "./components/BannerClient";
import prismadb from "@/lib/prismadb";
import { BannerColumn } from "./components/Columns";

const Banners = async ({ params }: { params: { storeId: string } }) => {
  const banner = await prismadb.banners.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBanners: BannerColumn[] = banner.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    imageUrl: item.imageUrl
  }))

  return (
    <div className="flex-col space-y-4 p-8 pt-6">
      <BannerClient data={formattedBanners}/>
    </div>
  );
};

export default Banners;
