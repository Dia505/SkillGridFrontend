import React, { useState } from "react";
import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import JobCategory from "./job_category";
import JobDetails from "./job_details";
import ServiceDetails from "./service_details";
import BioDetails from "./bio_details";

const queryClient = new QueryClient();

const BuildYourProfile = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    jobCategory: null,
    jobDetails: null,
    serviceDetails: null,
    bioDetails: null
  });

  const steps = [
    { component: JobCategory, name: "Job Category" },
    { component: JobDetails, name: "Job Details" },
    { component: ServiceDetails, name: "Service Details" },
    { component: BioDetails, name: "Bio Details" },
  ];

  const CurrentComponent = steps[currentStep].component;

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const isLastStep = currentStep === steps.length - 1;

  const submitProfile = useMutation((data) =>
    fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
  );

  const handleSubmit = async () => {
    try {
      await submitProfile.mutateAsync(formData);
      alert("Profile created successfully!");
    } catch (error) {
      alert("Error submitting profile");
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-lg mx-auto py-10 px-5 space-y-8">
        {/* Progress Bar */}
        <div className="w-full">
          <div className="relative w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="absolute bg-green-500 h-2.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-sm mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Current Step */}
        <div className="bg-white p-5 shadow-md rounded-md">
          <CurrentComponent
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLastStep={isLastStep}
            onSubmit={handleSubmit}
            data={formData[steps[currentStep].name.toLowerCase().replace(" ", "")]}
          />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default BuildYourProfile;
