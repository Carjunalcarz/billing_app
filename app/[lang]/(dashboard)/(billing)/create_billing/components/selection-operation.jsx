"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react"; // ✅ Import session
import moment from "moment";
import { useRouter } from "next/navigation"; // Use next/navigation for Next.js 13+
import { toast } from "@/components/ui/use-toast";

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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { users } from "../actions/data"; //DATA Source Dummy ..
import { fetchSubscribers, createBilling } from "../actions/api_caller";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SelectionOperation = () => {
  const { data: session, status } = useSession(); // ✅ Get session and auth status
  const [selectedRows, setSelectedRows] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    return moment(isoString).format("MMM DD, YYYY"); // Output: Mar 05, 2025
  };
  const handleSelectAll = (event) => {
    if (selectedRows?.length === users?.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(users.map((row) => row.id));
    }
  };

  const handleRowSelect = (id) => {
    const updatedSelectedRows = [...selectedRows];
    if (selectedRows.includes(id)) {
      updatedSelectedRows.splice(selectedRows.indexOf(id), 1);
    } else {
      updatedSelectedRows.push(id);
    }
    setSelectedRows(updatedSelectedRows);
  };
  const selectEvenRows = () => {
    const evenRowIds = users
      .filter((_, index) => index % 2 !== 0)
      .map((row) => row.id);
    setSelectedRows(evenRowIds);
  };

  const selectOddRows = () => {
    const oddRowIds = users
      .filter((_, index) => index % 2 === 0)
      .map((row) => row.id);
    setSelectedRows(oddRowIds);
  };
  // Fetch subscriptions only when authenticated
  const getSubscribers = useCallback(async () => {
    if (!session?.user?.accessToken) return;

    try {
      const data = await fetchSubscribers(session.user.accessToken);
      if (data.success) {
        setSubscriptions(data.data);
      } else {
        console.error("API error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  }, [session?.user?.accessToken]);

  useEffect(() => {
    if (status === "authenticated") {
      getSubscribers();
    }
  }, [status, getSubscribers]);

  function countDaysFromNow(dateString) {
    const givenDate = new Date(dateString);
    const now = new Date();

    // Calculate the difference in milliseconds
    const difference = now - givenDate;

    // Convert milliseconds to days
    const daysDifference = Math.ceil(difference / (1000 * 60 * 60 * 24));

    return daysDifference - 1;
  }

  const router = useRouter();
  const handleBills = (id) => {
    router.push(`/create_billing/${id}`); // Navigate to dynamic route
  };

  const postBills = async (subscription) => {
    const totalAmount = (
      (subscription.servicePlan.pricePerMonth / 30) *
      countDaysFromNow(subscription.startDate)
    ).toFixed(2);

    const postData = {
      subscription_id: subscription._id, // ✅ No need for template literals
      servicePlan_id: subscription.servicePlan._id,
      dueDate: new Date(subscription.startDate).toISOString(), // ✅ Convert to Date
      daysUsed: countDaysFromNow(subscription.startDate),
      totalAmount: parseFloat(totalAmount), // ✅ Convert to Number
      balance: 0, // ✅ Default value (previously "")
      paymentAmount: 0, // ✅ Default value (previously "")
    };

    try {
      // ✅ Retrieve token from session
      const token = session?.user?.accessToken;
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      // ✅ Make API request
      console.log(
        "📤 Sending request to API with data:",
        JSON.stringify(postData, null, 2)
      );

      const response = await createBilling(token, postData);

      if (!response || response.error) {
        throw new Error(response.error || "Unexpected API error");
      }

      // ✅ Display success toast
      toast({
        title: "Submission Successful",
        description: (
          <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <p className="text-primary-foreground">
              Your data has been submitted:
            </p>
            <pre>{JSON.stringify(postData, null, 2)}</pre>
          </div>
        ),
      });

      getSubscribers();
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || JSON.stringify(error.response.data)
        : error.message;

      console.error("❌ API Request Error:", errorMessage); // Debugging log

      // ❌ Error toast
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="flex items-center gap-1">
              <Checkbox
                checked={
                  selectedRows.length === users.length || "indeterminate"
                }
                onCheckedChange={handleSelectAll}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    color="secondary"
                    className=" h-7 rounded-full bg-transparent w-7 data-[state=open]:bg-primary data-[state=open]:text-primary-foreground  "
                  >
                    <Icon icon="heroicons:chevron-down" className=" h-4 w-4 " />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" avoidCollisions>
                  <DropdownMenuLabel>Action Center</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSelectAll}>
                    Select All Data
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRows([])}>
                    Invert Current Page
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRows([])}>
                    Clear All Data
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={selectOddRows}>
                    Select Odd Row
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={selectEvenRows}>
                    Select Even Row
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableHead>
          <TableHead className=" font-semibold">Name</TableHead>
          <TableHead>Plan - (Speed) </TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date Start</TableHead>
          <TableHead>Date Count</TableHead>
          <TableHead>Total Amount</TableHead>

          <TableHead className=" text-end">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {subscriptions.map((subscription) => (
          <TableRow
            key={subscription._id}
            className="hover:bg-muted"
            data-state={selectedRows.includes(subscription._id) && "selected"}
          >
            <TableCell>
              <Checkbox
                checked={selectedRows.includes(subscription._id)}
                onCheckedChange={() => handleRowSelect(subscription._id)}
              />
            </TableCell>

            <TableCell className="text-[0.8em]">
              {subscription.client.firstName} {subscription.client.lastName}
            </TableCell>
            <TableCell className="text-[0.8em]">
              {subscription.servicePlan.name} - (
              {subscription.servicePlan.speedMbps} MBPS){" "}
            </TableCell>
            <TableCell className="text-[0.8em]">
              ₱ {subscription.servicePlan.pricePerMonth}
            </TableCell>
            <TableCell className="text-[0.8em]">
              {formatDate(subscription.startDate)}
            </TableCell>
            <TableCell className="text-[0.8em]">
              {countDaysFromNow(subscription.startDate)}
            </TableCell>
            <TableCell className="text-[0.8em]">
              {(
                (subscription.servicePlan.pricePerMonth / 30) *
                countDaysFromNow(subscription.startDate)
              ).toFixed(2)}
            </TableCell>
            <TableCell className="flex justify-end">
              <div className="flex gap-3">
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
                          countDaysFromNow(subscription.startDate) > 30
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
                        This action cannot be undone. This will create
                        subscription billing.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => postBills(subscription)}
                      >
                        Create
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  onClick={() => handleBills(subscription._id)}
                  size="icon"
                  variant="outline"
                  className=" h-7 w-7"
                  color="secondary"
                >
                  <Icon icon="heroicons:eye" className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SelectionOperation;
