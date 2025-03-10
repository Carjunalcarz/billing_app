"use client";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import InvoiceListTable from "./invoice-list-table";

const bills = ({params}) => {
  const { data: session, status } = useSession();


  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Bills List</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Subscribers ID : {params.id}</BreadcrumbItem>
      </Breadcrumbs>
      <div className="mt-5 text-2xl font-medium text-default-900">
      <InvoiceListTable params = {params.id}/>
      </div>
    </div>
  );
};

export default bills;
