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
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    street: "",
    barangay: "",
    city: "",
    zipCode: "",
    idType: "",
    idNumber: "",
    file: null,
    facebookLink: "",
    twitterLink: "",
    applicationDate: "",
    accountActivatedDate: "",
    serverName: "",
    username: "",
  });

  const initialFormData = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    street: "",
    barangay: "",
    city: "",
    zipCode: "",
    idType: "",
    idNumber: "",
    file: null,
    facebookLink: "",
    twitterLink: "",
    applicationDate: "",
    accountActivatedDate: "",
    serverName: "",
    username: "",
  };

  const steps = ["Personal Info", "Address", "Social Links", "Account"];

  const isStepOptional = (step) => step === 1;

  const handleNext = (e) => {
    e.preventDefault(); // Prevent the form from submitting
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (e) => {
    e.preventDefault(); // Prevent the form from submitting
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

//   const handleReset = (e) => {
//     e.preventDefault(); // Prevent the form from submitting
//     setActiveStep(0);
//   };

  //   const onSubmit = () => {
  //     console.log(formData);
  //     toast({
  //       title: "You submitted the following values:",
  //       description: (
  //         <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 top-0 right-0">
  //           <p className="text-primary-foreground">Done</p>
  //           <pre>{JSON.stringify(formData, null, 2)}</pre>
  //         </div>
  //       ),
  //     });
  //   };

  const handleReset = (e) => {
    e.preventDefault(); // Prevent the form from submitting
    setFormData(initialFormData); // Reset formData to initial values
    setActiveStep(0); // Optionally, reset the active step (if using a stepper)
  };
  
  const onSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3002/api/forms', formData, {
        headers: {
          'Content-Type': 'application/json', // Set the content type as needed
          // Add Authorization headers if necessary
          // 'Authorization': 'Bearer ' + yourToken,
        },
      });
  
      toast({
        title: "You submitted the following values:",
        description: (
          <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 top-0 right-0">
            <p className="text-primary-foreground">Done</p>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </div>
        ),
      });
  
      // Reset the form after successful submission
      setFormData(initialFormData); // Reset form data to its initial state
      setActiveStep(0); // Reset stepper (if needed)
  
    } catch (error) {
      toast({
        title: 'Error',
        description: `There was an error: ${error.response ? error.response.data : error.message}`,
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
                      Enter Your Personal Info
                    </h4>
                    <p className="text-xs text-default-600 mt-1">
                      Fill in the box with correct data
                    </p>
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="text"
                      placeholder="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="text"
                      placeholder="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="number"
                      placeholder="Phone number"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="email"
                      placeholder="alcarz@gmail.com"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              {activeStep === 1 && (
                <>
                  <div className="col-span-12 mt-6 mb-4">
                    <h4 className="text-sm font-medium text-default-600">
                      Enter Your Address
                    </h4>
                    <p className="text-xs text-default-600 mt-1">
                      Fill in the box with correct data
                    </p>
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="text"
                      placeholder="Purok / ST."
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="text"
                      placeholder="Barangay"
                      name="barangay"
                      value={formData.barangay}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="text"
                      placeholder="City / Mun"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="number"
                      placeholder="Zip Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <Input
                      type="text"
                      placeholder="ID Type"
                      name="idType"
                      value={formData.idType}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <Input
                      type="number"
                      placeholder="ID Number"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <Input
                      type="file"
                      name="file"
                      onChange={handleFileChange}
                    />
                  </div>
                </>
              )}
              {activeStep === 2 && (
                <>
                  <div className="col-span-12 mt-6 mb-4">
                    <h4 className="text-sm font-medium text-default-600">
                      Enter Your Social Links
                    </h4>
                    <p className="text-xs text-default-600 mt-1">
                      Fill in the box with correct data
                    </p>
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="text"
                      placeholder="http://facebook.com/abc"
                      name="facebookLink"
                      value={formData.facebookLink}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="text"
                      placeholder="http://twitter.com/abc"
                      name="twitterLink"
                      value={formData.twitterLink}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              {activeStep === 3 && (
                <>
                  <div className="col-span-12 mt-6 mb-4">
                    <h4 className="text-sm font-medium text-default-600">
                      Account
                    </h4>
                    <p className="text-xs text-default-600 mt-1">
                      Fill in the box with correct data
                    </p>
                  </div>

                  <div className="col-span-12 lg:col-span-6">
                    <label className="text-sm" htmlFor="">
                      Date of Application
                    </label>
                    <Input
                      type="date"
                      placeholder="Date Apply"
                      name="applicationDate"
                      value={formData.applicationDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <label className="text-sm" htmlFor="">
                      Account Activated Date
                    </label>
                    <Input
                      type="date"
                      placeholder="Activated Date"
                      name="accountActivatedDate"
                      value={formData.accountActivatedDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <label className="text-sm" htmlFor="">
                      Server Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Server Name"
                      name="serverName"
                      value={formData.serverName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <label className="text-sm" htmlFor="">
                      Username
                    </label>
                    <Input
                      type="text"
                      placeholder="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
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
