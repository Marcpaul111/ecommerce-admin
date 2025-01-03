"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";
import Image from "next/image";


export type ProductColumn = {
  id: string;
  name: string;
  imageUrl: string;
  isFeatured: boolean;
  isArchived: boolean;
  price: string;
  category: string;
  size: string;
  color: string;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
 
  {
    accessorKey: "image",
    header: "Image",
    cell: ({row}) => (
      <div className="flex items-center gap-x-2">
       <Image src={row.original.imageUrl} alt="image" height={50} width={50}/>
      </div>
    )
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({row}) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div className="h-6 2-6 rounded-lg"  style={{backgroundColor: row.original.color}}/>
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
