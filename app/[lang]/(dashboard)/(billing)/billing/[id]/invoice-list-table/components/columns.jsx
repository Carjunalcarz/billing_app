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
import { deleteBilling, updateBilling , paidBilling } from "../action/api_caller";
import { PrinterIcon, BanknotesIcon } from "@heroicons/react/24/outline";
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
export const columns = (getBillings) => [
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
      <div>{row.getValue("daysUsed") ? row.getValue("daysUsed") : "N/A"}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bill Created" />
    ),
    cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
    enableSorting: true,
    enableHiding: false,
  },

  {
    accessorKey: "isPaid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Status" />
    ),
    cell: ({ row }) => (
      <div>{row.getValue("isPaid") === true ? "Paid" : "Pending"}</div>
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
      <div>
        {" "}
        {row.getValue("totalAmount") ? row.getValue("totalAmount") : "N/A"}
      </div>
    ),

    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "actions",
    header: "Action",

    cell: ({ row }) => {
      const router = useRouter();
      const { data: session, status } = useSession(); // ✅ Get session and auth status
      const billing = row.original; // Ensure this aligns with your data structure
      const token = session?.user?.accessToken;
      // console.log("TOKEN :::::::::::", token);
      const postBills = async () => {
        const postData = {
          _id: billing._id,
          status: true,
        };

        try {
          if (!token) throw new Error("Authentication token is missing");

          // console.log(
          //   "📤 Sending request to API:",
          //   JSON.stringify(postData, null, 2)
          // );

          const response = await updateBilling(token, postData);

          if (!response || response.error)
            throw new Error(response.error || "Unexpected API error");

          toast({
            title: "Submission Successful",
            description: (
              <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <p className="text-primary-foreground">
                  Your data has been submitted:
                </p>
                {/* <pre>{JSON.stringify(postData, null, 2)}</pre> */}
              </div>
            ),
          });

          getBillings();
        } catch (error) {
          const errorMessage = error.response
            ? error.response.data.message || JSON.stringify(error.response.data)
            : error.message;

          console.error("❌ API Request Error:", errorMessage);

          toast({
            title: "Error",
            description: (
              <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <pre
                  className="text-red-600"
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    padding: "10px",
                  }}
                >
                  {JSON.stringify(errorMessage, null, 2)}
                </pre>
              </div>
            ),
          });
        }
      };

      const deleteBills = async () => {
        const postData = {
          _id: billing._id,
          status: true,
        };

        try {
          if (!token) throw new Error("Authentication token is missing");

          // console.log(
          //   "📤 Sending request to API:",
          //   JSON.stringify(postData, null, 2)
          // );

          const response = await deleteBilling(token, postData);

          if (!response || response.error)
            throw new Error(response.error || "Unexpected API error");

          toast({
            title: "Deleted Successful",
            description: (
              <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <p className="text-red-700">Your data has been deleted</p>
                {/* <pre>{JSON.stringify(postData, null, 2)}</pre> */}
              </div>
            ),
          });

          getBillings();
        } catch (error) {
          const errorMessage = error.response
            ? error.response.data.message || JSON.stringify(error.response.data)
            : error.message;

          console.error("❌ API Request Error:", errorMessage);

          toast({
            title: "Error",
            description: (
              <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <pre
                  className="text-red-600"
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    padding: "10px",
                  }}
                >
                  {JSON.stringify(errorMessage, null, 2)}
                </pre>
              </div>
            ),
          });
        }
      };

      const paidBills = async () => {
        const postData = {
          _id: billing._id,
          isPaid: true,
        };

        try {
          if (!token) throw new Error("Authentication token is missing");

          // console.log(
          //   "📤 Sending request to API:",
          //   JSON.stringify(postData, null, 2)
          // );

          const response = await paidBilling(token, postData);

          if (!response || response.error)
            throw new Error(response.error || "Unexpected API error");

          toast({
            title: "Submission Successful",
            description: (
              <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <p className="text-primary-foreground">
                  Your payment has been submitted:
                </p>
                {/* <pre>{JSON.stringify(postData, null, 2)}</pre> */}
              </div>
            ),
          });

          getBillings();
        } catch (error) {
          const errorMessage = error.response
            ? error.response.data.message || JSON.stringify(error.response.data)
            : error.message;

          console.error("❌ API Request Error:", errorMessage);

          toast({
            title: "Error",
            description: (
              <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <pre
                  className="text-red-600"
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    padding: "10px",
                  }}
                >
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
                disabled={billing.status} // Disables the button if status is true
              >
                <div></div>

                {billing.status ? (
                  <Icon
                    icon="heroicons-solid:check"
                    className="h-4 w-4 text-green-700 font-bold"
                  />
                ) : (
                  <Icon
                    icon="heroicons-solid:x-mark"
                    className="h-4 w-4 text-red-700 font-bold "
                  />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure want to approved billing?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will approved billing.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={(e) => postBills(billing)}>
                  Approved
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
                color="secondary"
                disabled={!billing.status} // Disables the button if status is true
              >
              <BanknotesIcon  className="text-yellow-500"/>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure want to pay the bills?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will pay your bill.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => paidBills(billing)}
                  className="bg-black hover:bg-red-600 transition-colors"
                >
                  Pay
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
                color="secondary"
                // disabled={billing.status} // Disables the button if status is true
              >
                <Icon
                  icon="heroicons-solid:trash"
                  className="h-4 w-4 text-red-700 font-bold "
                />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure want to delete billing?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will delete billing.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => deleteBills(billing)}
                  className="bg-black hover:bg-red-600 transition-colors"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
         
        </div>
      );
    },
  },
];
