import { PlusIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import AddServiceForm from "./add_service_form";

function ServiceDetails({ data, updateData }) {
    const [showAddServiceForm, setShowAddServiceForm] = useState(false); // State to show/hide the form
    const [serviceData, setServiceData] = useState(data?.service_details || []); // Store the list of services

    const updateServiceDetails = (newService) => {
        // Update the service details in the parent
        const updatedServices = [...serviceData, newService];
        setServiceData(updatedServices);
        updateData({ service_details: updatedServices }); // Send the updated data back to the parent component
    };

    const handleDeleteService = (index) => {
        // Remove the service at the specified index
        const updatedServices = serviceData.filter((_, i) => i !== index);
        setServiceData(updatedServices);
        updateData({ service_details: updatedServices }); // Send the updated data back to the parent component
    };

    // Disable form toggle if there are 3 or more services
    const handleAddServiceClick = () => {
        if (serviceData.length < 3) {
            setShowAddServiceForm(!showAddServiceForm); // Toggle the form visibility
        }
    };

    return (
        <div className="ml-24 mr-40 mt-4">
            <h2 className="text-2xl font-caprasimo text-purple-700">Highlight your services</h2>
            <p className="text-purple-700 text-lg mt-2">Specify the services you specialize in to attract the right clients.</p>

            {/* Render the dashed box if no services are added */}
            {serviceData.length === 0 ? (
                <div className="flex flex-col gap-4 justify-center items-center w-[349px] h-[265px] border border-dashed border-grey-400 rounded-2xl mt-4">
                    <p className="text-xl text-grey-700">Add a service</p>
                    <button
                        onClick={handleAddServiceClick} // Use the function to check the number of services
                        className="bg-purple-700 rounded-full w-[35px] h-[35px]"
                    >
                        <PlusIcon className="w-9 h-6 text-purple-50" />
                    </button>
                </div>
            ) : (
                // Render the list of added services
                <div className="flex flex-col">
                    <div className="flex gap-6 mt-4">
                        {serviceData.map((service, index) => (
                            <div
                                key={index}
                                className="flex flex-col justify-center pl-8 w-[349px] h-[265px] border border-grey-400 rounded-2xl mt-4"
                            >
                                <div className="flex gap-4">
                                    {service.uploadedFiles.map((file, idx) => (
                                        <img
                                            key={idx}
                                            src={file}
                                            alt={`Service Image ${idx + 1}`}
                                            className="w-[278px] h-[146px] object-cover rounded-md"
                                        />
                                    ))}
                                </div>
                                <h3 className="text-purple-700 text-xl font-bold mt-2">{service.service_name}</h3>
                                <div className="flex justify-between">
                                    <p className="text-grey-700 text-lg">Rs. {service.hourly_rate}/hr</p>
                                    <div className="flex mr-8 gap-2">
                                        <button className="border-2 border-purple-700 w-[30px] h-[30px] rounded-full text-[14px]">✏️</button>
                                        {/* Delete button now calls handleDeleteService */}
                                        <button 
                                            onClick={() => handleDeleteService(index)}
                                            className="border-2 border-purple-700 w-[30px] h-[30px] rounded-full text-[14px]"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Button only visible if there are less than 3 services */}
                    {serviceData.length < 3 && (
                        <button
                            onClick={handleAddServiceClick}
                            className="border-2 border-purple-700 w-[45px] h-[45px] rounded-full text-[36px] text-purple-700 flex justify-center items-center mt-6 ml-36"
                        >
                            +
                        </button>
                    )}
                </div>
            )}

            {/* Conditionally render AddServiceForm */}
            {showAddServiceForm && (
                <>
                    <div className="fixed inset-0 bg-grey-500 bg-opacity-50 z-10"></div> {/* Grey overlay */}
                    <div className="fixed inset-0 flex justify-center items-center z-20">
                        <AddServiceForm
                            closeForm={() => setShowAddServiceForm(false)}
                            updateServiceDetails={updateServiceDetails} // Pass the function to child
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default ServiceDetails;
