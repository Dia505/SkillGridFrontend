import axios from "axios";
import { jwtDecode } from "jwt-decode";
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
    { component: JobCategory, name: "job_category" },
    { component: JobDetails, name: "job_details" },
    { component: ServiceDetails, name: "service_details" },
    { component: BioDetails, name: "bio" },
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

      // Data for the freelancer table (job_category, job_details, bio)
      const freelancerData = {
        job_category: formData.job_category,
        job_details: formData.job_details,
        bio: formData.bio,
      };

      // Submit freelancer data
      await axios.put(`http://localhost:3000/api/freelancer/${freelancerId}`, freelancerData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Data for the service table (service_name)
      const serviceData = formData.service_details.map(service => ({
        service_name: service.service_name
      }));

      // Submit services to service table and store service ids
      const serviceResponse = await axios.post('http://localhost:3000/api/service', serviceData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const serviceIds = serviceResponse.data.map(service => service.id); // Assuming response contains service ids

      // Data for freelancer_service table (service_id, hourly_rate)
      const freelancerServiceData = formData.service_details.map((service, index) => ({
        freelancer_id: freelancerId,
        service_id: serviceIds[index],
        hourly_rate: service.hourly_rate,
      }));

      // Submit freelancer_service data
      await axios.post('http://localhost:3000/api/freelancer_service', freelancerServiceData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Data for the portfolio table (file_path, upload_date, freelancer_service_id)
      const portfolioData = formData.service_details.map((service, index) => {
        return service.uploadedFiles.map(filePath => ({
          file_path: filePath,
          upload_date: new Date(),
          freelancer_service_id: freelancerServiceData[index].id, // Assuming this ID is generated after posting to freelancer_service
        }));
      }).flat();

      // Submit portfolio data
      await axios.post('http://localhost:3000/api/portfolio', portfolioData, {
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
    <div className="h-screen overflow-auto flex flex-col pt-10 pl-16 bg-purple-50">
      <AppLogo2 />

      <p className="ml-24 mt-10 text-purple-700">
        Build your profile {currentStep + 1}/{steps.length}
      </p>

      {/* Current Step */}
      <div>
        <CurrentComponent
          data={formData[steps[currentStep].name]} // Pass correct data (e.g., job_details)
          updateData={updateData} // Pass updateData function to each step
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
  );
};

export default BuildYourProfile;
