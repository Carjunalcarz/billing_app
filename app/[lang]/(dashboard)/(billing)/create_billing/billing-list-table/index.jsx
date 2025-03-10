"use client";

import React ,{ Fragment,useEffect, useState, useCallback  } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { data } from "./data";
import { useSession } from "next-auth/react"; // ✅ Import session
import {fetchBilling} from "./action/api_caller"
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { useRouter } from "next/navigation"; // Use next/navigation for Next.js 13+
import { toast } from "@/components/ui/use-toast";

import {fetchSubscribers} from "./action/api_caller"




export default function SubscriptionListTable() {
  const { data: session, status } = useSession(); // ✅ Get session and auth status
  const [subscriptions, setSubscriptions] = useState([]);

  // Fetch subscriptions only when authenticated
  const getSubscription= useCallback(async () => {
    if (!session?.user?.accessToken) return;

    try {
      const data = await fetchSubscribers(session.user.accessToken);
      console.log("RESULT ::::",data);
      if (data.success) {
        setSubscriptions(data.data);
      } else {
        console.error("API error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching billings:", error);
    }
  }, [session?.user?.accessToken]);

  useEffect(() => {
    if (status === "authenticated") {
      getSubscription();
    }
  }, [status, getSubscription]);



  return (
    <Fragment>
      <DataTable data={subscriptions}  columns={columns(getSubscription)}  />
    </Fragment>
  );
}
