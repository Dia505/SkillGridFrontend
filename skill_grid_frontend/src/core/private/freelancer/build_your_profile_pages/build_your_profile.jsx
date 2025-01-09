import axios from "axios";
import {jwtDecode} from "jwt-decode";
import React, { useState } from "react";
import AppLogo2 from "../../../../components/app_logo2";
import BioDetails from "./bio_details";
import JobCategory from "./job_category";
import JobDetails from "./job_details";
import ServiceDetails from "./service_details_files/service_details";

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
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const decoded = jwtDecode(token);
      const freelancerId = decoded.id;

      // Update profile data
      await axios.put(`http://localhost:3000/api/freelancer/${freelancerId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile built successfully!");
    } catch (error) {
      console.error("Error submitting profile:", error);
      alert("Error submitting profile. Please try again.");
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      <div className="h-screen overflow-auto flex flex-col pt-10 pl-16 bg-purple-50">
        <AppLogo2 />

        <p className="ml-24 mt-10 text-purple-700">
          Build your profile {currentStep + 1}/{steps.length}
        </p>

        {/* Current Step */}
        <div>
          <CurrentComponent
            data={formData[steps[currentStep].name.toLowerCase().replace(" ", "")]}
            updateData={updateData}
          />
        </div>

        {/* Progress Bar */}
        <div className="w-full flex fixed bottom-20 left-0">
          <div className="relative w-full bg-grey-100 rounded-full h-2.5">
            <div
              className="absolute bg-purple-700 h-2.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex fixed bottom-5">
          <button
            onClick={handlePrevious}
            className="w-[126px] h-[40px] bg-purple-50 border-2 border-purple-700 text-purple-700 font-caprasimo rounded-lg"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            className="w-auto h-[40px] pl-7 pr-7 bg-purple-700 border-2 border-purple-700 text-purple-50 font-caprasimo rounded-lg fixed right-16"
          >
            {currentStep === steps.length - 1 ? "View My Profile" : "Next"}
          </button>
        </div>
      </div>
    </>
  );
};

export default BuildYourProfile;
