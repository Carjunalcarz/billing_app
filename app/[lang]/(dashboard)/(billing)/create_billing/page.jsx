"use client";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { useSession } from "next-auth/react";
import SelectionOperation from "./components/selection-operation"
import SubscriptionListTable from "./billing-list-table"
// import BasicWizard from "./components/basic-form";

const createBilling = () => {
  const { data: session, status } = useSession();

  // console.log(session);

  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Billing</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Create Billing</BreadcrumbItem>
      </Breadcrumbs>
      <div className="mt-5 text-2xl font-medium text-default-900">
        {/* <SelectionOperation /> */}
        <SubscriptionListTable  />
      </div>
    </div>
  );
};

export default createBilling;
