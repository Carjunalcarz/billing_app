"use client";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CreateBilling from "../components/create_billing";
const Printing = ({params}) => {
  const { data: session, status } = useSession();


  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Print Preview</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Print ID : {params.id}</BreadcrumbItem>
      </Breadcrumbs>
      <div className="mt-5 text-2xl font-medium text-default-900">
        <CreateBilling id={params.id} session_data = {session} status = {status}/>
      </div>
    </div>
  );
};

export default Printing;
