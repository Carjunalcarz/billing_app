"use client";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { useSession } from "next-auth/react";
import  RowEditingDialog from "./components/row-editing-dialog";

const Subscribers = () => {
  const { data: session, status } = useSession();

  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Subscribers</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Subscribers List</BreadcrumbItem>
      </Breadcrumbs>
      <div className="mt-5 text-2xl font-medium text-default-900">
       <RowEditingDialog/>
      </div>
    </div>
  );
};

export default Subscribers;
