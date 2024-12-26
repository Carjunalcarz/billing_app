"use client";
import React, { useState } from "react";
import { Stepper, Step, StepLabel } from "@/components/ui/steps";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "@/hooks/use-media-query";

const BasicWizard = () => {
  const { data: session } = useSession();  // Ensure session is available
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

  const handleNext = () => {
    // Validate current step fields
    if (activeStep === 0) {
      if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.email) {
        toast({
          title: "Error",
          description: "Please fill all personal info fields.",
        });
        return;
      }
    }

    if (activeStep === 1) {
      // Address validation
      if (!formData.street || !formData.barangay || !formData.city || !formData.zipCode) {
        toast({
          title: "Error",
          description: "Please fill all address fields.",
        });
        return;
      }
    }
    if (activeStep === 2) {
      if (!formData.facebookLink || !formData.twitterLink) {
        toast({
          title: "Error",
          description: "Please fill all social media links.",
        });
        return;
      }
    }

    if (activeStep === 3) {
      if (!formData.applicationDate || !formData.accountActivatedDate) {
        toast({
          title: "Error",
          description: "Please fill all account fields.",
        });
        return;
      }
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = (e) => {
    e.preventDefault(); // Prevent the form from submitting
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFormData(initialFormData);
    setActiveStep(0);
  };

  const onSubmit = async () => {
    try {
      const token = session?.user?.accessToken;

      if (!token) {
        throw new Error('Authentication token is missing');
      }

      const response = await axios.post(
        'http://localhost:3002/api/forms', 
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "Form submitted successfully.",
      });

      setFormData(initialFormData);
      setActiveStep(0);

    } catch (error) {
      toast({
        title: 'Error',
        description: `Error: ${error.message}`,
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
            labelProps.optional = <StepLabel variant="caption">Optional</StepLabel>;
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
            <Button
              size="xs"
              variant="outline"
              color="destructive"
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
              {/* Personal Info Step */}
              {activeStep === 0 && (
                <>
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
                      placeholder="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              {/* Address Step */}
              {activeStep === 1 && (
                <>
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="text"
                      placeholder="Street"
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
                      placeholder="City"
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
                </>
              )}
              {/* Social Links Step */}
              {activeStep === 2 && (
                <>
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="text"
                      placeholder="Facebook"
                      name="facebookLink"
                      value={formData.facebookLink}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="text"
                      placeholder="Twitter"
                      name="twitterLink"
                      value={formData.twitterLink}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              {/* Account Step */}
              {activeStep === 3 && (
                <>
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="text"
                      placeholder="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <Input
                      type="text"
                      placeholder="Server Name"
                      name="serverName"
                      value={formData.serverName}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="mt-6 flex space-x-2">
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
              {activeStep === steps.length - 1 ? (
                <Button size="sm" onClick={onSubmit}>
                  Submit
                </Button>
              ) : (
                <Button size="sm" onClick={handleNext}>
                  Next
                </Button>
              )}
            </div>
          </form>
        </React.Fragment>
      )}
    </div>
  );
};

export default BasicWizard;
