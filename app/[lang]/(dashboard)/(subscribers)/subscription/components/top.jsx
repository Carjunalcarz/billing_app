import React, { useState, useEffect } from "react";
import { Stepper, Step, StepLabel } from "@/components/ui/steps";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSession } from "next-auth/react";
import Select from "react-select";

const BasicWizard = () => {
  const { data: session } = useSession();  // Ensure session is available
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

  const handleNext = () => {
    // Check if the current step has valid data
    if (activeStep === 0 && !formData.user) {
      toast({
        title: "Error",
        description: "Please select a user.",
      });
      return;
    }

    if (activeStep === 0 && !formData.servicePlan) {
      toast({
        title: "Error",
        description: "Please select a service plan.",
      });
      return;
    }

    if (activeStep === 1 && !formData.startDate) {
      toast({
        title: "Error",
        description: "Please select a start date.",
      });
      return;
    }

    if (activeStep === 1 && !formData.endDate) {
      toast({
        title: "Error",
        description: "Please select an end date.",
      });
      return;
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setActiveStep(0);
  };

  // Fetch Plans from the API when the component mounts
  useEffect(() => {
    const fetchPlans = async () => {
      if (session?.user?.accessToken) {
        const token = session.user.accessToken;

        try {
          const response = await fetch("http://localhost:3002/api/service-plans", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
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

  // Fetch users from the API when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      if (session?.user?.accessToken) {
        const token = session.user.accessToken;

        try {
          const response = await fetch("http://localhost:3002/api/forms", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();
          if (data.success) {
            setUsers(data.data); // Set the fetched users data
          } else {
            console.error("API error:", data.message);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      }
    };

    if (session?.user) {
      fetchUsers();
    }
  }, [session]);

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
    setFormData({
      ...formData,
      user: selectedOption ? selectedOption.value : "",
    });
  };

  const handlePlanChange = (selectedOption) => {
    setFormData({
      ...formData,
      servicePlan: selectedOption ? selectedOption.value : "",
    });
  };

  const isTablet = useMediaQuery("(max-width: 1024px)");

  const userOptions = users.map((user) => ({
    value: user._id,
    label: `${user.firstName} ${user.lastName}`,
  }));

  const plansOptions = plans
    .filter((plan) => plan.isActive)
    .map((plan) => ({
      value: plan._id,
      label: `${plan.name} - ${plan.speedMbps}MBPS`,
    }));
    const styles = {
        option: (provided, state) => ({
          ...provided,
        }),
      };
    }
