import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import AppLogo2 from "../../../../components/app_logo/app_logo2";
import BioDetails from "./bio_details";
import JobCategory from "./job_category";
import JobDetails from "./job_details";
import ServiceDetails from "./service_details_files/service_details";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BuildYourProfile = () => {
  const navigate = useNavigate();
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
    //-----------------Update freelancer table-----------------------
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

      //---------------------Add Service-----------------------
      const serviceData = formData.service_details.map(service => ({
        service_name: service.service_name,
      }));

      let serviceIds = [];

      if (serviceData.length > 0) {
        for (const service of serviceData) {
          try {
            const serviceResponse = await axios.post('http://localhost:3000/api/service', service, {
              headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Service Response:", serviceResponse.data);

            // Store service ID
            if (serviceResponse.data && serviceResponse.data._id) {
              serviceIds.push(serviceResponse.data._id);
            }
          } catch (error) {
            console.error("Error inserting service:", error.response?.data || error.message);
          }
        }
      }

      console.log("Service IDs:", serviceIds);

      //-----------------Add Freelancer-Service-----------------------
      let freelancerServiceIds = [];

      for (let i = 0; i < formData.service_details.length; i++) {
        try {
          const freelancerService = {
            freelancer_id: freelancerId,
            service_id: serviceIds[i], // Ensure correct mapping
            hourly_rate: formData.service_details[i].hourly_rate,
          };

          const freelancerServiceResponse = await axios.post(
            'http://localhost:3000/api/freelancer-service',
            freelancerService,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          console.log("Freelancer-Service Response:", freelancerServiceResponse.data);

          // Store freelancer-service ID
          if (freelancerServiceResponse.data && freelancerServiceResponse.data._id) {
            freelancerServiceIds.push(freelancerServiceResponse.data._id);
          }
        } catch (error) {
          console.error("Error inserting freelancer-service:", error.response?.data || error.message);
        }
      }

      console.log("Freelancer Service IDs:", freelancerServiceIds);


      //-----------------Add Portfolio-----------------------
      // Portfolio mapping
      const portfolioData = formData.service_details
        .filter(service => service.uploadedFiles && service.uploadedFiles.length > 0) // Ensure uploaded files exist
        .map((service, index) => ({
          file_path: service.uploadedFiles,
          upload_date: new Date().toISOString(),
          freelancer_service_id: freelancerServiceIds[index] ?? freelancerServiceIds[0],
        }));

      console.log("Portfolio Data:", portfolioData);

      if (portfolioData.length > 0) {
        for (const portfolioItem of portfolioData) {
          const formData = new FormData();

          // Append each file to the formData with the field name "file_path"
          portfolioItem.file_path.forEach((file) => {
            formData.append("file_path", file); // Ensure the field name matches what multer expects
            console.log(file);
          });

          // Append additional data (upload_date and freelancer_service_id)
          formData.append("upload_date", portfolioItem.upload_date);
          formData.append("freelancer_service_id", portfolioItem.freelancer_service_id);

          // Send all files in a single request
          try {
            const response = await axios.post('http://localhost:3000/api/portfolio', formData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data", // Ensure this is set correctly
              },
            });
            console.log("Portfolio item uploaded successfully:", response.data);
          } catch (error) {
            console.error("Error uploading portfolio item:", error);
          }
        }
      } else {
        console.log("No portfolio data to upload.");
      }

      toast.success("Profile built successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "colored",
    });
      navigate("/login");
      window.location.reload();

    } catch (error) {
      console.error("Error submitting profile:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error submitting profile. Please try again.");
    }
  }


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
