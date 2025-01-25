import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import AppLogo2 from "../../../../components/app_logo/app_logo2";
import BioDetails from "./bio_details";
import JobCategory from "./job_category";
import JobDetails from "./job_details";
import ServiceDetails from "./service_details_files/service_details";

const BuildYourProfile = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    job_category: null,
    profession: null,
    skills: null,
    years_of_experience: null,
    service_details: [],
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
      if (!token) {
        alert("Authentication token missing. Please log in again.");
        return;
      }
      const decoded = jwtDecode(token);
      const freelancerId = decoded.userId;

      const freelancerData = {
        job_category: formData.job_category,
        profession: formData.profession,
        skills: formData.skills,
        years_of_experience: formData.years_of_experience,
        bio: formData.bio,
      };

      await axios.put(`http://localhost:3000/api/freelancer/${freelancerId}`, freelancerData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const serviceData = formData.service_details.map(service => ({
        service_name: service.service_name,
      }));

      if (serviceData.length > 0) {
        const serviceResponse = await axios.post('http://localhost:3000/api/service',
          serviceData.length === 1 ? serviceData[0] : serviceData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Service Response:", serviceResponse.data);

        // Ensure serviceResponse.data is an array
        const serviceIds = Array.isArray(serviceResponse.data)
          ? serviceResponse.data.map(service => service._id)
          : [serviceResponse.data._id];

        // Freelancer service mapping
        const freelancerServiceData = formData.service_details.map((service, index) => ({
          freelancer_id: freelancerId,
          service_id: serviceIds[index] ?? serviceIds[0], // Fallback to first ID if index is out of bounds
          hourly_rate: service.hourly_rate,
        }));

        const freelancerServiceResponse = await axios.post(
          'http://localhost:3000/api/freelancer-service',
          freelancerServiceData.length === 1 ? freelancerServiceData[0] : freelancerServiceData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Ensure freelancerServiceResponse.data is an array
        const freelancerServiceIds = Array.isArray(freelancerServiceResponse.data)
          ? freelancerServiceResponse.data.map(service => service._id)
          : [freelancerServiceResponse.data._id];

        // Portfolio mapping
        const portfolioData = formData.service_details
          .filter(service => service.uploadedFiles && service.uploadedFiles.length > 0) // Ensure uploaded files exist
          .map((service, index) => ({
            file_path: service.uploadedFiles, // Store all file paths in an array
            upload_date: new Date().toISOString(), // Ensure a proper ISO date format
            freelancer_service_id: freelancerServiceIds[index] ?? freelancerServiceIds[0], // Ensure correct mapping
          }));

        console.log("Portfolio Data:", portfolioData); // Debugging

        if (portfolioData.length === 1) {
          // If only one service, send it as an object
          await axios.post('http://localhost:3000/api/portfolio', portfolioData[0], {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (portfolioData.length > 1) {
          // If multiple services, send them as an array
          await axios.post('http://localhost:3000/api/portfolio', portfolioData, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          console.log("No portfolio data to upload.");
        }

      }

      alert("Profile built successfully!");
    } catch (error) {
      console.error("Error submitting profile:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error submitting profile. Please try again.");
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
