"use client";

import { ColumnDef, RowExpanding } from "@tanstack/react-table";
import CellAction from "./CellAction";



export type ColorColumn = {
  id: string;
  name: string;
  createdAt: string;
  value: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
  
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({  row  }) => (
      <div className="flex items-center gap-x-2">
       {row.original.value}
       <div className="h-6 w-6 rounded-lg border" style={{backgroundColor: row.original.value}} />
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
