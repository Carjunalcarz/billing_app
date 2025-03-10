"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Link from "next/link";
import moment from "moment";
import { useParams } from "next/navigation";


const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  return moment(isoString).format("MMM DD, YYYY"); // Output: Mar 05, 2025
};

export const columns = [
  
  {
    id: "id",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="INVOICE ID" />
    ),
    cell: ({ row }) => <div>{row.getValue("_id")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "daysUsed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Days" />
    ),
    cell: ({ row }) => (
      <div >
        {row.getValue("daysUsed") ? row.getValue("daysUsed") : "N/A"}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => (
      <div >{formatDate(row.getValue("startDate"))}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => (
      <div > {row.getValue("totalAmount") ? row.getValue("totalAmount") : "N/A"}</div>
    ),

    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-3 items-center justify-end">
        <Button
          asChild
          size="icon"
          className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
        >
          <Link href="/invoice-details">
            <Icon icon="heroicons:eye" className="w-5 h-5" />
          </Link>
        </Button>
        <Button
          size="icon"
          className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
        >
          <Icon icon="heroicons:pencil-square" className="w-5 h-5" />
        </Button>
        <Button
          size="icon"
          className="h-9 w-9 rounded bg-default-100 dark:bg-default-200 text-default-500 hover:text-primary-foreground"
        >
          <Icon icon="heroicons:trash" className="w-5 h-5" />
        </Button>
      </div>
    ),
  },
];
