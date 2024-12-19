"use client";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { useSession } from "next-auth/react";
import BasicWizard from "./components/basic-form";

const Subscription = () => {
  const { data: session, status } = useSession();

  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Subscription</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Add Subscribers</BreadcrumbItem>
      </Breadcrumbs>
      <div className="mt-5 text-2xl font-medium text-default-900">
        <BasicWizard />
      </div>
    </div>
  );
};

export default Subscription;
