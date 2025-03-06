"use client";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { useSession } from "next-auth/react";
import BasicWizard from "./components/basic-form";

const Billing = () => {
  const { data: session, status } = useSession();

  // console.log(session);

  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Billing</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Add Client</BreadcrumbItem>
      </Breadcrumbs>
      <div className="mt-5 text-2xl font-medium text-default-900">
        <BasicWizard />
      </div>
    </div>
  );
};

export default Billing;
