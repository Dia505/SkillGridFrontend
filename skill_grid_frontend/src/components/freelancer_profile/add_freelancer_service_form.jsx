import { yupResolver } from "@hookform/resolvers/yup";
import React, { useRef, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/auth_context";
import { toast } from "react-toastify";

function AddFreelancerServiceForm({ closeForm }) {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const { authToken, userId } = useAuth();

    const serviceDetailsSchema = yup.object().shape({
        service_name: yup.string().required("*required"),
        hourly_rate: yup.string().required("*required"),
        skill_portfolio: yup
            .mixed()
            .test("has-images", "*You must upload at least one picture.", () => {
                return uploadedFiles && uploadedFiles.length > 0; // Validate if at least one file exists
            }),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm({
        resolver: yupResolver(serviceDetailsSchema),
    });

    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);

        if (uploadedFiles.length + files.length > 4) {
            alert("You can only upload up to 4 pictures.");
            return;
        }

        const newPreviewUrls = files.map((file) => URL.createObjectURL(file));

        setUploadedFiles((prevFiles) => [...prevFiles, ...files]);

        setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);

        if (errors.skill_portfolio) {
            clearErrors("skill_portfolio");
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current.click();
    };

    const removeImage = (index) => {
        setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const onSubmit = async (data) => {
        const serviceData = { service_name: data.service_name };
    
        try {
            const serviceResponse = await fetch("http://localhost:3000/api/service", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(serviceData),
            });
    
            const serviceResult = await serviceResponse.json();
            if (!serviceResponse.ok) throw new Error(serviceResult.message || "Error saving service data.");
    
            const freelancerServiceData = {
                hourly_rate: data.hourly_rate,
                service_id: serviceResult._id, 
                freelancer_id: userId,
            };
    
            // Save freelancer service data
            const freelancerServiceResponse = await fetch("http://localhost:3000/api/freelancer-service", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(freelancerServiceData),
            });
    
            const freelancerServiceResult = await freelancerServiceResponse.json();
            if (!freelancerServiceResponse.ok) throw new Error(freelancerServiceResult.message || "Error saving freelancer service data.");
    
            const portfolioData = new FormData();
            uploadedFiles.forEach((file) => {
                portfolioData.append("file_path", file);
            });
            portfolioData.append("freelancer_service_id", freelancerServiceResult._id);
    
            const portfolioResponse = await fetch("http://localhost:3000/api/portfolio", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                },
                body: portfolioData,
            });
    
            const portfolioResult = await portfolioResponse.json();
            if (!portfolioResponse.ok) throw new Error(portfolioResult.message || "Error saving portfolio data.");
    
            toast.success("Service added successfully!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
            closeForm();  
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    return (
        <>
            <div className="flex flex-col relative bg-purple-50 rounded-2xl w-[747px] h-[655px] pl-16 pt-2">
                <button
                    onClick={closeForm}
                    className="text-grey-400 font-light text-[40px] absolute right-7">
                    X
                </button>

                <h2 className="text-2xl font-inter font-bold text-purple-700 mt-14">Add a service</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4 w-[435px] mt-7 w-[330px]">
                        <div>
                            <label className="font-inter text-purple-700 text-[15px] ml-2">Service name</label>
                            <input
                                type="text"
                                {...register("service_name")}
                                className={`border ${errors.service_name ? "border-red-500" : "border-purple-700"} 
                                                bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                                ${errors.service_name ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                            />
                            {errors.service_name && <p className="mt-1 text-sm text-red-500">{errors.service_name.message}</p>}
                        </div>

                        <div>
                            <label className="font-inter text-purple-700 text-[15px] ml-2">Hourly rate</label>
                            <input
                                type="text"
                                {...register("hourly_rate")}
                                className={`border ${errors.hourly_rate ? "border-red-500" : "border-purple-700"} 
                                                bg-purple-50 p-2 w-full rounded-xl focus:outline-none focus:ring-2 
                                                ${errors.hourly_rate ? "focus:ring-red-500" : "focus:ring-purple-700"}`}
                            />
                            {errors.hourly_rate && <p className="mt-1 text-sm text-red-500">{errors.hourly_rate.message}</p>}
                        </div>

                        <button
                            type="button"
                            onClick={triggerFileUpload}
                            className={`w-[187px] h-[47px] ${uploadedFiles.length >= 4 ? "bg-gray-400 cursor-not-allowed" : "bg-purple-700"} 
                text-purple-50 rounded-xl font-inter mt-6`}
                            disabled={uploadedFiles.length >= 4}
                        >
                            🖼️ Upload Pictures
                        </button>

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple 
                            style={{ display: "none" }}
                        />

                        {previewUrls.length > 0 && (
                            <div className="w-[500px] flex gap-4 mt-4">
                                {previewUrls.map((file, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={file}
                                            alt={`Uploaded Preview ${index + 1}`}
                                            className="w-[126px] h-[126px] object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-1 bg-purple-50 text-[13px] border rounded-full w-5 h-5 flex justify-center"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-[126px] h-[40px] bg-purple-700 font-caprasimo text-purple-50 rounded-xl">
                            Save
                        </button>

                    </div>
                </form>
            </div>
        </>
    )
}

export default AddFreelancerServiceForm;