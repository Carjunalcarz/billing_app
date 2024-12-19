import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Stepper, Step, StepLabel } from "@/components/ui/steps";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useMediaQuery } from "@/hooks/use-media-query";

import {
  Select as CustomSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BasicWizard = () => {
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    user: "",
    servicePlan: "",
    isActive: true,
    startDate: "",
    endDate: "",
  });

  const initialFormData = {
    user: "",
    servicePlan: "",
    isActive: true,
    startDate: "",
    endDate: "",
  };
 
  const steps = ["Speed Plan", "Duration", "Set Status"];

  const isStepOptional = (step) => step === 1;

  const handleNext = (e) => {
    e.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFormData(initialFormData);
    setActiveStep(0);
  };

  // Fetch Plans from the API when the component mounts
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/service-plans"); // Update with your API URL
        const data = await response.json();

        if (data.success) {
          setPlans(data.data); // Set the fetched service plans data
        } else {
          console.error("API error:", data.message);
        }
      } catch (error) {
        console.error("Error fetching service plans:", error);
      }
    };

    fetchPlans();
  }, []);

  // Fetch users from the API when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/forms"); // Update with your API URL
        const data = await response.json();

        if (data.success) {
          setUsers(data.data); // Set the fetched users data
        } else {
          console.error("API error:", data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        "http://localhost:3002/api/subscriptions",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Submission Successful",
        description: (
          <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <p className="text-primary-foreground">
              Your data has been submitted:
            </p>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </div>
        ),
      });

      setFormData(initialFormData);
      setActiveStep(0);
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || JSON.stringify(error.response.data)
        : error.message;

      toast({
        title: "Error",
        description: (
          <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <pre
              className="text-red-600"
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                padding: "10px",
              }}
            >
              {JSON.stringify(errorMessage, null, 2)}
            </pre>
          </div>
        ),
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUserChange = (selectedOption) => {
    // selectedOption contains the { value, label }
    setFormData({
      ...formData,
      user: selectedOption ? selectedOption.value : "", // Set user id or empty if cleared
    });
  };

  const handlePlanChange = (selectedOption) => {
    // selectedOption contains the { value, label }
    setFormData({
      ...formData,
      servicePlan: selectedOption ? selectedOption.value : "", // Set user id or empty if cleared
    });
  };

  const isTablet = useMediaQuery("(max-width: 1024px)");
  const styles = {
    option: (provided, state) => ({
      ...provided,
    }),
  };

  const userOptions = users.map((user) => ({
    value: user._id, // assuming _id is the unique identifier
    label: `${user.firstName} ${user.lastName}`, // assuming firstName and lastName are present
  }));

  const plansOptions = plans
    .filter((plan) => plan.isActive) // Filter out inactive plans
    .map((plan) => ({
      value: plan._id, // Assuming _id is the unique identifier
      label: `${plan.name} - ${plan.speedMbps}MBPS`, // Construct the label only for active plans
    }));

  return (
    <div className="mt-4">
      <Stepper current={activeStep} direction={isTablet && "vertical"}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <StepLabel variant="caption">Optional</StepLabel>
            );
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <React.Fragment>
          <div className="mt-2 mb-2 font-semibold text-center">
            All steps completed - you're finished
          </div>
          <div className="flex pt-2">
            <div className="flex-1" />
            <Button
              size="xs"
              variant="outline"
              color="destructive"
              className="cursor-pointer"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-12 gap-4">
              {activeStep === 0 && (
                <>
                  <div className="col-span-12 mt-6 mb-4">
                    <h4 className="text-sm font-medium text-default-600">
                      Enter Plan Name
                    </h4>
                    <p className="text-xs text-default-600 mt-1">
                      Fill in the box with correct data
                    </p>
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <label className="text-sm">Select User</label>
                    <Select
                      className="react-select text-sm"
                      classNamePrefix="select"
                      value={userOptions.find(
                        (option) => option.value === formData.user
                      )}
                      onChange={handleUserChange} // Handle change to update the selected user ID
                      options={userOptions}
                      isLoading={users.length === 0}
                      isClearable={false}
                      styles={styles}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <label className="text-sm">Select Plan</label>
                    <Select
                      className="react-select text-sm"
                      classNamePrefix="select"
                      value={plansOptions.find(
                        (option) => option.value === formData.servicePlan
                      )}
                      onChange={handlePlanChange} // Handle change to update the selected user ID
                      options={plansOptions}
                      isLoading={plans.length === 0}
                      isClearable={false}
                      styles={styles}
                    />
                  </div>
                </>
              )}

              {activeStep === 1 && (
                <>
                  <div className="col-span-12 mt-6 mb-4">
                    <h4 className="text-sm font-medium text-default-600">
                      Duration
                    </h4>
                    <p className="text-xs text-default-600 mt-1">
                      Fill in the box with correct data
                    </p>
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <label className="text-sm" htmlFor="">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      placeholder=""
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <label className="text-sm" htmlFor="">
                      End Date
                    </label>
                    <Input
                      type="date"
                      placeholder=""
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              {activeStep === 2 && (
                <>
                  <div className="col-span-12 mt-6 mb-4">
                    <h4 className="text-sm font-medium text-default-600">
                      Set Status
                    </h4>
                    <p className="text-xs text-default-600 mt-1">
                      Set the plan's activation status.
                    </p>
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <label className="text-sm">Activation Status</label>
                    <CustomSelect
                      value={formData.isActive.toString()}
                      onValueChange={(value) =>
                        setFormData({ ...formData, isActive: value === "true" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </CustomSelect>
                  </div>
                </>
              )}

              <div className="col-span-12 mt-8 text-right">
                <Button
                  size="sm"
                  variant="outline"
                  color="destructive"
                  className="cursor-pointer"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleNext}
                  disabled={activeStep === steps.length - 1}
                  className="ml-2"
                >
                  Next
                </Button>

                {activeStep === steps.length - 1 && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={onSubmit}
                    className="ml-2"
                  >
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </form>
        </React.Fragment>
      )}
    </div>
  );
};

export default BasicWizard;