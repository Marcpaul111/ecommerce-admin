"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";
import Image from "next/image";


export type BannerColumn = {
  id: string;
  label: string;
  createdAt: string;
  imageUrl: string;
};

export const columns: ColumnDef<BannerColumn>[] = [
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => (
      <div className="w-16 h-16 p-1">
        <Image
          src={row.original.imageUrl}
          alt={row.original.label}
          width={100}
          height={100}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
    ),
  },
  {
    accessorKey: "label",
    header: "Label",
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
