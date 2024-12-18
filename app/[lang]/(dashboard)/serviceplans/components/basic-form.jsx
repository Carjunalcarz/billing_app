"use client";
import React, { useState } from "react";
import { Stepper, Step, StepLabel } from "@/components/ui/steps";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

const BasicWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    speedMbps: 0,
    dataLimitGB: 0,
    pricePerMonth: 0,
    description: "",
    isActive: true,
  });

  const initialFormData = {
    name: "",
    speedMbps: 0,
    dataLimitGB: 0,
    pricePerMonth: 0,
    description: "",
    isActive: true,
  };

  const steps = ["Speed Plan", "Limit", "Price", "Description"];

  const isStepOptional = (step) => step === 1;

  const handleNext = (e) => {
    e.preventDefault(); // Prevent the form from submitting
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (e) => {
    e.preventDefault(); // Prevent the form from submitting
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = (e) => {
    e.preventDefault(); // Prevent the form from submitting
    setFormData(initialFormData); // Reset formData to initial values
    setActiveStep(0); // Optionally, reset the active step (if using a stepper)
  };

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      const response = await axios.post(
        "http://localhost:3002/api/service-plans",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Success toast
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

      // Reset the form and stepper
      setFormData(initialFormData);
      setActiveStep(0);
    } catch (error) {
      // Extract and display error message
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const isTablet = useMediaQuery("(max-width: 1024px)");

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
                    <label className="text-sm" htmlFor="">
                      Plan Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Plan Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <label className="text-sm" htmlFor="">
                      Speed MBPS
                    </label>
                    <Input
                      type="text"
                      placeholder="Speed MBPS"
                      name="speedMbps"
                      value={formData.speedMbps}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              {activeStep === 1 && (
                <>
                  <div className="col-span-12 mt-6 mb-4">
                    <h4 className="text-sm font-medium text-default-600">
                      Enter Plan Limit
                    </h4>
                    <p className="text-xs text-default-600 mt-1">
                      Fill in the box with correct data
                    </p>
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <label className="text-sm" htmlFor="">
                      LIMIT MBPS / [0] - Unlimited
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter 0 No limit"
                      name="dataLimitGB"
                      value={formData.dataLimitGB}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              {activeStep === 2 && (
                <>
                  <div className="col-span-12 mt-6 mb-4">
                    <h4 className="text-sm font-medium text-default-600">
                      Enter Price
                    </h4>
                    <p className="text-xs text-default-600 mt-1">
                      Fill in the box with correct data
                    </p>
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <label className="text-sm" htmlFor="">
                      Price
                    </label>
                    <Input
                      type="number"
                      placeholder=""
                      name="pricePerMonth"
                      value={formData.pricePerMonth}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              {activeStep === 3 && (
                <>
                  <div className="col-span-12 mt-6 mb-4">
                    <h4 className="text-sm font-medium text-default-600">
                      Description
                    </h4>
                    <p className="text-xs text-default-600 mt-1">
                      Fill in the box with correct data
                    </p>
                  </div>

                  <div className="col-span-12 lg:col-span-6">
                    <textarea
                      className="text-sm p-4"
                      rows="5"
                      name="description"
                      cols="100"
                      value={formData.description}
                      onChange={handleInputChange}
                    ></textarea>
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
