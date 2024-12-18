"use client";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { useSession } from "next-auth/react";
import BasicWizard from "./components/basic-form";

const ServicePlans = () => {
  const { data: session, status } = useSession();

  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Service Plans</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Add Plan</BreadcrumbItem>
      </Breadcrumbs>
      <div className="mt-5 text-2xl font-medium text-default-900">
        <BasicWizard />
      </div>
    </div>
  );
};

export default ServicePlans;
