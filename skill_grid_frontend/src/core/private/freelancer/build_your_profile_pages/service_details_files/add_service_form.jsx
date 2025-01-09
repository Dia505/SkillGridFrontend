import { yupResolver } from "@hookform/resolvers/yup";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Yup validation schema
const serviceDetailsSchema = yup.object().shape({
    service_name: yup.string().required("*required"),
    hourly_rate: yup.string().required("*required"),
    skill_portfolio: yup.number().required("*required"),
});

function AddServiceForm({ closeForm, updateServiceDetails }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(serviceDetailsSchema),
    });

    const fileInputRef = useRef(null); // Reference to the hidden file input
    const [uploadedFile, setUploadedFile] = useState(null); // State for the uploaded image

    const onSubmit = (data) => {
        // Call the passed updateServiceDetails function to send the data back to parent
        updateServiceDetails({ ...data, uploadedFile }); // Include the uploaded file in the data
        closeForm(); // Close the form after submission
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            setUploadedFile(URL.createObjectURL(file)); // Create a preview URL for the uploaded file
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current.click(); // Programmatically click the hidden file input
    };

    return (
        <div className="flex flex-col relative bg-purple-50 rounded-2xl w-[747px] h-auto pl-16 pt-2 pb-20">
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

                    {/* Upload Picture Button */}
                    <button
                        type="button"
                        onClick={triggerFileUpload}
                        className="w-[187px] h-[47px] bg-purple-700 text-purple-50 rounded-xl font-inter mt-6"
                    >
                        🖼️ Upload Picture
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                    {uploadedFile && (
                        <div className="flex flex-col gap-2 mt-2">
                            <p className="text-sm text-grey-700">Preview:</p>
                            <img src={uploadedFile} alt="Uploaded Preview" className="w-32 h-32 object-cover rounded-md" />
                        </div>
                    )}

                    <div className="flex absolute right-7 bottom-10">
                        <button
                            type="button"
                            onClick={closeForm}
                            className="w-[126px] h-[40px] font-caprasimo text-grey-700">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-[126px] h-[40px] bg-purple-700 font-caprasimo text-purple-50 rounded-xl">
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddServiceForm;
