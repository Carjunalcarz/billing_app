"use client";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { useSession } from "next-auth/react";
import InvoicePreview from "./components/InvoicePreview"
const Subscribers = () => {
  const { data: session, status } = useSession();

  return (
    <div>
      {/* <Breadcrumbs>
        <BreadcrumbItem>Reports</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Preview</BreadcrumbItem>
      </Breadcrumbs> */}
      <div className="text-2xl font-medium text-default-900">
      <InvoicePreview />

      </div>
    </div>
  );
};

export default Subscribers;
