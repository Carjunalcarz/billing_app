"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";

const FormAutoSize = ({
  startDate,
  endDate,
  is_Active,
  plan_id,
  subscription,
  onClose,
  fetchSubscribers,
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // Ensure startDate is a valid Date object before calling toISOString
  const formattedStartDate = startDate
    ? new Date(startDate).toISOString().split("T")[0]
    : "";

  const formattedEndDate = endDate
    ? new Date(endDate).toISOString().split("T")[0]
    : "";

  // Convert is_Active to string ("true" or "false")
  const isActiveDefault = is_Active ? "true" : "false";

  const { data: session } = useSession(); // Ensure session is available
  const [plans, setPlans] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(isActiveDefault); // Default status

  // formData state to hold all the form values
  const [formData, setFormData] = useState({
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    selectedPlan: plan_id,
    selectedStatus: selectedStatus,
  });

  // Fetch Plans from the API when the component mounts
  useEffect(() => {
    const fetchPlans = async () => {
      if (session?.user?.accessToken) {
        const token = session.user.accessToken;

        try {
          const response = await fetch(
            `${apiUrl}/api/service-plans`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          if (data.success) {
            setPlans(data.data); // Set the fetched service plans data
          } else {
            console.error("API error:", data.message);
          }
        } catch (error) {
          console.error("Error fetching service plans:", error);
        }
      }
    };

    if (session?.user) {
      fetchPlans();
    }
  }, [session]);

  // Set the default selected plan when plans are fetched and plan_id is available
  useEffect(() => {
    if (plans.length > 0 && plan_id) {
      const defaultPlan = plans.find((plan) => plan._id === plan_id);
      if (defaultPlan) {
        setFormData((prevState) => ({
          ...prevState,
          selectedPlan: {
            value: defaultPlan._id,
            label: `${defaultPlan.name} - ${defaultPlan.speedMbps}MBPS`,
          },
        }));
      }
    }
  }, [plans, plan_id]);

  const plansOptions = plans
    .filter((plan) => plan.isActive)
    .map((plan) => ({
      value: plan._id,
      label: `${plan.name} - ${plan.speedMbps}MBPS`,
    }));

  const isActiveOptions = [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

const styles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#ffffff" : provided.backgroundColor, // White background when selected
    color: state.isSelected ? "#000000" : provided.color, // Black text when selected
  }),
};

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: selectedOption,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the updated data object
    const updatedData = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      servicePlan: formData.selectedPlan?.value,
      isActive: formData.selectedStatus?.value, // Boolean conversion directly
    };

    try {
      // Make the PUT request to update the subscription
      const response = await fetch(
        `${apiUrl}/api/subscriptions/${subscription}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Add Authorization header if needed
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Show success toast before closing the dialog

        toast({
          title: "Updated Successful",
          // description: (
          //   <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          //     <p className="text-primary-foreground">
          //       Your data has been submitted:
          //     </p>
          //     <pre>{JSON.stringify(formData, null, 2)}</pre>
          //   </div>
          // ),
        });

        // Close the dialog after success
        onClose();

        fetchSubscribers();
      } else {
        console.error("Error updating subscription:", data.message);
        // Handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error making PUT request:", error);
      // Handle error (e.g., show an error message)
    }
  };
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-4">
          <div className="w-full">
            <label className="text-sm">Start Date</label>
            <Input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              placeholder="Start Date"
            />
          </div>

          {/* <div className="w-full">
            <label className="text-sm">End Date</label>
            <Input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              placeholder="End Date"
            />
          </div> */}

          {/* Plan Selection */}
          <div className="w-full">
            <label className="text-sm">Select Plan</label>
            <Select
              className="react-select text-sm"
              classNamePrefix="select"
              value={formData.selectedPlan} // Set default value for Select
              onChange={(selectedOption) =>
                handleSelectChange("selectedPlan", selectedOption)
              } // Handle selection change
              options={plansOptions}
              isLoading={plans.length === 0}
              isClearable={false}
              styles={styles}
            />
          </div>

          {/* Active Status Selection */}
          <div className="w-full">
            <label className="text-sm">Select Status</label>
            <Select
              className="react-select text-sm"
              classNamePrefix="select"
              value={isActiveOptions.find(
                (option) => option.value === formData.selectedStatus
              )}
              onChange={(selectedOption) =>
                handleSelectChange("selectedStatus", selectedOption)
              } // Handle status change
              options={isActiveOptions}
              isLoading={plans.length === 0}
              isClearable={false}
              styles={styles}
            />
          </div>

          <Button type="submit">Update Form</Button>
        </div>
      </form>
    </div>
  );
};

export default FormAutoSize;
