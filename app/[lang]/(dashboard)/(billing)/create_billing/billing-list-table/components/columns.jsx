"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/navigation"; // Use next/navigation for Next.js 13+
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react"; // ✅ Import session
import { createBilling } from "../action/api_caller";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getValue } from "@unovis/ts";
const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  return moment(isoString).format("MMM DD, YYYY"); // Output: Mar 05, 2025
};


function countDaysFromNow(dateString) {
  const givenDate = new Date(dateString);
  const now = new Date();

  // Calculate the difference in milliseconds
  const difference = now - givenDate;

  // Convert milliseconds to days
  const daysDifference = Math.ceil(difference / (1000 * 60 * 60 * 24));

  return daysDifference - 1;
}

export const columns = (getSubscription)=> [
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
    accessorKey: "fullname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => <div>{`${row.original?.client?.firstName} ${row.original?.client?.lastName} `}</div>,
    enableSorting: true,
    enableHiding: false,
    filterFn: (row, columnId, filterValue) => {
      const fullName = `${row.original?.client?.firstName} ${row.original?.client?.lastName}`.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    }
  },
  {
    accessorKey: "PlanSpeed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plan - (Speed)" />
    ),
    cell: ({ row }) => (
      <div>{row.original?.servicePlan?.name ? row.original?.servicePlan?.name : "N/A"} / {row.original?.servicePlan?.name ? `(${row.original?.servicePlan?.speedMbps}) MBPS`  : "N/A"}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "Amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => <div>₱{row.original.servicePlan.pricePerMonth}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue("startDate"))}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "countingDays",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Counting Days" />
    ),
    cell: ({ row }) => <div>{ countDaysFromNow(formatDate(row.getValue("startDate")))}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => (
      <div>
        {(row.original.servicePlan.pricePerMonth/30*countDaysFromNow(formatDate(row.getValue("startDate")))).toFixed(2)}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    
    cell: ({ row }) => {
      const router = useRouter();
      const { data: session, status } = useSession(); // ✅ Get session and auth status
      const subscription = row.original; // Ensure this aligns with your data structure
      const token = session?.user?.accessToken;
      // console.log("TOKEN :::::::::::", token);
      const postBills = async () => {
        const totalAmount = (
          (subscription.servicePlan.pricePerMonth / 30) *
          countDaysFromNow(subscription.startDate)
        ).toFixed(2);
  
        const postData = {
          subscription_id: subscription._id,
          servicePlan_id: subscription.servicePlan._id,
          dueDate: new Date(subscription.startDate).toISOString(),
          daysUsed: countDaysFromNow(subscription.startDate),
          totalAmount: parseFloat(totalAmount),
          balance: 0,
          paymentAmount: 0,
        };
  
        try {
          
         
          if (!token) throw new Error("Authentication token is missing");
  
          console.log("📤 Sending request to API:", JSON.stringify(postData, null, 2));
  
          const response = await createBilling(token, postData);
  
          if (!response || response.error) throw new Error(response.error || "Unexpected API error");
  
          toast({
            title: "Submission Successful",
            description: (
              <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <p className="text-primary-foreground">Your data has been submitted:</p>
                <pre>{JSON.stringify(postData, null, 2)}</pre>
              </div>
            ),
          });
  
          getSubscription();
        } catch (error) {
          const errorMessage = error.response
            ? error.response.data.message || JSON.stringify(error.response.data)
            : error.message;
  
          console.error("❌ API Request Error:", errorMessage);
  
          toast({
            title: "Error",
            description: (
              <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <pre className="text-red-600" style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", padding: "10px" }}>
                  {JSON.stringify(errorMessage, null, 2)}
                </pre>
              </div>
            ),
          });
        }
      };
  
      return (
        <div className="flex gap-3 items-center justify-end">
         <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
                color="secondary"
              >
                <Icon
                  icon="heroicons:document-text"
                  className={`h-4 w-4 ${
                    countDaysFromNow(row.getValue("startDate")) >= 30
                      ? "text-red-700"
                      : "text-green-700"
                  }`}
                />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure want to create billing?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will create subscription
                  billing.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={(e) => postBills(subscription)}>
                  Create
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            onClick={() => router.push(`/billing/${row.original?._id}`)}
            size="icon"
            variant="outline"
            className="h-7 w-7"
            color="secondary"
          >
            <Icon icon="heroicons:eye" className="h-4 w-4" />
          </Button>
          
        </div>
      );
    },
  },
  
];
