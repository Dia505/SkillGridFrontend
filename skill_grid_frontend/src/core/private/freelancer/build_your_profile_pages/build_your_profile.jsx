import React, { useState } from "react";
import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import JobCategory from "./job_category";
import JobDetails from "./job_details";
import ServiceDetails from "./service_details";
import BioDetails from "./bio_details";

const BuildYourProfile = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    job_category: null,
    job_details: null,
    service_details: null,
    bio: null,
  });

  const steps = [
    { component: JobCategory, name: "Job Category" },
    { component: JobDetails, name: "Job Details" },
    { component: ServiceDetails, name: "Service Details" },
    { component: BioDetails, name: "Bio Details" },
  ];

  const CurrentComponent = steps[currentStep].component;

  const updateData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Submit data
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

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
    <div>
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
      <CurrentComponent
        data={formData[steps[currentStep].name.toLowerCase().replace(" ", "")]}
        updateData={updateData}
      />

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        {currentStep > 0 && (
          <button
            onClick={handlePrevious}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Previous
          </button>
        )}
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {currentStep === steps.length - 1 ? "View My Profile" : "Next"}
        </button>
      </div>
    </div>
  );
};
